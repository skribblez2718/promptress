"""
title: pdf_document_tool
author: sketch
version: 2.1.0
license: MIT
description: Create or modify PDF documents and return them as downloadable attachments in Open WebUI chat.
requirements: reportlab,pypdf,pydantic
"""

from __future__ import annotations

import asyncio
import base64
import io
import os
import re
import tempfile
import uuid
from datetime import datetime
from typing import Any, Dict, List, Literal, Optional, Tuple, Union, Set

from pydantic import BaseModel, Field, ValidationError, field_validator

# Open WebUI internals - UPDATED IMPORTS for 0.5.x+
from open_webui.models.users import Users
from open_webui.models.files import Files, FileForm
from open_webui.storage.provider import Storage

# PDF generation & processing
from reportlab.lib.pagesizes import LETTER, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Image as RLImage,
    Table,
    TableStyle,
)
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader, PdfWriter


# ----------------------------
# Pydantic Schemas & Enums
# ----------------------------

FileType = Literal["pdf"]
OperationType = Literal["create", "modify"]


class ImageSpec(BaseModel):
    """Image to insert, by filename (from __files__) or bytes via base64."""

    name: Optional[str] = Field(
        default=None, description="File name of the image as uploaded/attached."
    )
    b64: Optional[str] = Field(
        default=None, description="Base64-encoded binary of the image."
    )
    width_inches: float = Field(
        default=3.0, ge=0.1, le=20.0, description="Image display width in inches."
    )


class ParagraphSpec(BaseModel):
    """Paragraph with optional inline formatting."""

    text: str = Field(..., description="Paragraph text. Basic <b>, <i>, <u> supported.")
    bold: bool = Field(default=False)
    italic: bool = Field(default=False)
    underline: bool = Field(default=False)
    font_name: Optional[str] = Field(
        default=None,
        description=(
            "Font face to use. Allowed: built-ins (Helvetica, Times-Roman, Courier and variants) "
            "or modern families (Inter, Roboto, SourceSans3, OpenSans, NotoSans, Lato, IBMPlexSans, Montserrat) "
            "when their TTF/OTF files are attached to the message. Unavailable fonts fall back to Helvetica."
        ),
    )
    font_size_pt: Optional[float] = Field(default=None, ge=6.0, le=96.0)
    leading_pt: Optional[float] = Field(
        default=None, ge=6.0, le=120.0, description="Line spacing in points."
    )
    align: Optional[Literal["left", "center", "right", "justify"]] = Field(
        default="left"
    )


class TableSpec(BaseModel):
    """Simple table from a 2D array of strings/numbers."""

    rows: List[List[Union[str, float, int, None]]] = Field(
        ..., min_length=1, description="2D data for table."
    )
    header: bool = Field(
        default=False, description="If true, style the first row as a header."
    )
    col_widths_inches: Optional[List[float]] = Field(
        default=None, description="Optional per-column widths in inches."
    )
    style_grid: bool = Field(default=True, description="Draw thin grid lines.")


class PdfInstructions(BaseModel):
    """Operations for generating flowing PDF content."""

    title: Optional[str] = Field(default=None, description="Document title metadata.")
    author: Optional[str] = Field(default=None, description="Document author metadata.")
    subject: Optional[str] = Field(
        default=None, description="Document subject metadata."
    )

    page_size: Literal["LETTER", "A4"] = Field(default="LETTER")
    margins_inches: Dict[str, float] = Field(
        default_factory=lambda: {
            "left": 1.0,
            "right": 1.0,
            "top": 1.0,
            "bottom": 1.0,
        },
        description="Page margins in inches: left/right/top/bottom.",
    )

    header_text: Optional[str] = Field(default=None)
    footer_text: Optional[str] = Field(default=None)
    show_page_numbers: bool = Field(default=True)

    paragraphs: List[ParagraphSpec] = Field(default_factory=list)
    tables: List[TableSpec] = Field(default_factory=list)
    images: List[ImageSpec] = Field(default_factory=list)

    @field_validator("margins_inches")
    @classmethod
    def _check_margins(cls, v: Dict[str, float]) -> Dict[str, float]:
        for k in ("left", "right", "top", "bottom"):
            if k not in v:
                v[k] = 1.0
            val = float(v[k])
            if not (0.0 <= val <= 3.0):
                raise ValueError(f"Margin '{k}' must be between 0.0 and 3.0 inches.")
            v[k] = val
        return v


class PdfToolParams(BaseModel):
    """
    Input schema for the pdf_document_tool.
    """

    file_type: FileType = Field(..., description="Must be 'pdf'.")
    operation: OperationType = Field(..., description="'create' or 'modify'.")
    instructions: Optional[PdfInstructions] = Field(
        default=None, description="Structured instructions; recommended over free-form."
    )
    raw_instructions: Optional[Dict[str, Any]] = Field(default=None)
    source_filename_hint: Optional[str] = Field(default=None)
    source_path: Optional[str] = Field(
        default=None, description="Existing PDF path for modify operations."
    )
    output_basename: Optional[str] = Field(
        default=None, description="Base name for the generated file (no extension)."
    )

    @field_validator("output_basename")
    @classmethod
    def _clean_basename(cls, v: Optional[str]) -> Optional[str]:
        if not v:
            return v
        safe = "".join(ch for ch in v if ch.isalnum() or ch in ("-", "_", " "))
        return safe.strip() or None


# ----------------------------
# Utilities
# ----------------------------

# Built-in fonts always available
_BUILTIN_FONTS: Set[str] = {
    "Helvetica",
    "Helvetica-Bold",
    "Helvetica-Oblique",
    "Helvetica-BoldOblique",
    "Times-Roman",
    "Times-Bold",
    "Times-Italic",
    "Times-BoldItalic",
    "Courier",
    "Courier-Bold",
    "Courier-Oblique",
    "Courier-BoldOblique",
}

# Modern, widely adopted, open-source families (must be attached as TTF/OTF to use)
_MODERN_FAMILIES: Set[str] = {
    "Inter",
    "Roboto",
    "SourceSans3",  # a.k.a. Source Sans 3
    "OpenSans",
    "NotoSans",
    "Lato",
    "IBMPlexSans",
    "Montserrat",
}

# Updated at runtime with any registered modern faces so we only allow installed/registered names.
_ALLOWED_FONTS: Set[str] = set(_BUILTIN_FONTS)


def _now_stamp() -> str:
    return datetime.now().strftime("%Y%m%d_%H%M%S")


def _choose_output_name(file_type: FileType, base: Optional[str]) -> str:
    root = base or f"document_{_now_stamp()}"
    ext = ".pdf"
    return f"{root}{ext}"


def _friendly_error(prefix: str, exc: Exception) -> str:
    return f"{prefix}: {type(exc).__name__} — {str(exc) or 'unexpected error'}"


def _get_content_type(_: str) -> str:
    return "application/pdf"


def _find_attached_file(
    expected_ext: str,
    files: Optional[List[Dict[str, Any]]] = None,
    hint: Optional[str] = None,
) -> Optional[Tuple[str, bytes]]:
    """
    Pick a file from __files__ by extension (and optional name hint).
    Accepts content either in 'content' (base64) or 'b64' keys or 'path' (not recommended).
    """
    if not files:
        return None

    # Try hint first
    if hint:
        for f in files:
            name = f.get("name") or f.get("filename") or ""
            if (
                name
                and name.lower() == hint.lower()
                and name.lower().endswith(expected_ext)
            ):
                data = None
                if "content" in f and isinstance(f["content"], str):
                    data = base64.b64decode(f["content"])
                elif "b64" in f and isinstance(f["b64"], str):
                    data = base64.b64decode(f["b64"])
                elif (
                    "path" in f
                    and isinstance(f["path"], str)
                    and os.path.isfile(f["path"])
                ):
                    with open(f["path"], "rb") as fh:
                        data = fh.read()
                if data:
                    return (name, data)

    # Otherwise first matching extension
    for f in files:
        name = f.get("name") or f.get("filename") or ""
        if name and name.lower().endswith(expected_ext):
            data = None
            if "content" in f and isinstance(f["content"], str):
                data = base64.b64decode(f["content"])
            elif "b64" in f and isinstance(f["b64"], str):
                data = base64.b64decode(f["b64"])
            elif (
                "path" in f and isinstance(f["path"], str) and os.path.isfile(f["path"])
            ):
                with open(f["path"], "rb") as fh:
                    data = fh.read()
            if data:
                return (name, data)

    return None


# ----------------------------
# Font registration (modern fonts via attachments)
# ----------------------------

_FONT_EXT_RE = re.compile(r"\.(ttf|otf)$", re.IGNORECASE)

# Map filename prefixes to canonical family names to avoid ambiguity
_FAMILY_HINTS = {
    "inter": "Inter",
    "roboto": "Roboto",
    "sourcesans3": "SourceSans3",
    "source-sans-3": "SourceSans3",
    "open-sans": "OpenSans",
    "opensans": "OpenSans",
    "noto-sans": "NotoSans",
    "notosans": "NotoSans",
    "lato": "Lato",
    "ibm-plex-sans": "IBMPlexSans",
    "ibmplexsans": "IBMPlexSans",
    "montserrat": "Montserrat",
}


def _derive_family_from_filename(fname: str) -> Optional[str]:
    base = os.path.splitext(os.path.basename(fname))[0].lower()
    for key, fam in _FAMILY_HINTS.items():
        if base.startswith(key):
            return fam
    return None


def _detect_style_flags(fname: str) -> Tuple[bool, bool]:
    """Return (bold, italic) flags based on filename hints."""
    lower = os.path.basename(fname).lower()
    if "bolditalic" in lower or (
        "bold" in lower and ("italic" in lower or "oblique" in lower)
    ):
        return True, True
    bold = "bold" in lower or "semibold" in lower or "medium" in lower
    italic = "italic" in lower or "oblique" in lower
    return bold, italic


def _register_fonts_from_files(__files__: Optional[List[Dict[str, Any]]]) -> Set[str]:
    """
    Register modern TTF/OTF fonts provided as attachments.
    Returns the set of successfully registered face names to be added to _ALLOWED_FONTS.
    """
    registered: Set[str] = set()
    if not __files__:
        return registered

    for f in __files__:
        name = (f.get("name") or f.get("filename") or "").strip()
        if not name or not _FONT_EXT_RE.search(name):
            continue

        family = _derive_family_from_filename(name)
        if not family or family not in _MODERN_FAMILIES:
            continue

        # Load bytes safely from attachment (no server path access)
        raw: Optional[bytes] = None
        try:
            if "content" in f and isinstance(f["content"], str):
                raw = base64.b64decode(f["content"])
            elif "b64" in f and isinstance(f["b64"], str):
                raw = base64.b64decode(f["b64"])
        except Exception:
            raw = None

        if not raw or len(raw) > 25 * 1024 * 1024:
            continue

        # Persist to temp file; TTFont expects a file path
        try:
            with tempfile.NamedTemporaryFile(
                suffix=os.path.splitext(name)[1], delete=True
            ) as tf:
                tf.write(raw)
                tf.flush()

                face_name = os.path.splitext(os.path.basename(name))[0]
                face_name = re.sub(r"[^\w\-\.]", "_", face_name)

                pdfmetrics.registerFont(TTFont(face_name, tf.name))
                registered.add(face_name)

                bold, italic = _detect_style_flags(name)
                pdfmetrics.addMapping(family, bold, italic, face_name)
                if not bold and not italic:
                    registered.add(family)
        except Exception:
            continue

    return registered


# ----------------------------
# PDF generation helpers
# ----------------------------


def _make_onpage(
    header_text: Optional[str], footer_text: Optional[str], show_page_numbers: bool
):
    def _draw(canvas, doc):
        width, height = canvas._pagesize
        if header_text:
            canvas.setFont("Helvetica", 9)
            canvas.setFillColor(colors.grey)
            canvas.drawString(doc.leftMargin, height - doc.topMargin + 12, header_text)
            canvas.line(
                doc.leftMargin,
                height - doc.topMargin + 8,
                width - doc.rightMargin,
                height - doc.topMargin + 8,
            )
        footer_line_y = doc.bottomMargin - 10
        canvas.setStrokeColor(colors.lightgrey)
        canvas.line(
            doc.leftMargin, footer_line_y, width - doc.rightMargin, footer_line_y
        )
        y_text = footer_line_y - 12
        if footer_text:
            canvas.setFont("Helvetica", 9)
            canvas.setFillColor(colors.grey)
            canvas.drawString(doc.leftMargin, y_text, footer_text)
        if show_page_numbers:
            canvas.setFont("Helvetica", 9)
            canvas.setFillColor(colors.grey)
            canvas.drawRightString(width - doc.rightMargin, y_text, f"Page {doc.page}")

    return _draw


def _wrap_text_with_inline_tags(p: ParagraphSpec) -> str:
    text = p.text
    if p.bold:
        text = f"<b>{text}</b>"
    if p.italic:
        text = f"<i>{text}</i>"
    if p.underline:
        text = f"<u>{text}</u>"
    return text


def _safe_font_choice(requested: Optional[str]) -> str:
    """
    Return a font name that is both allowed and registered.
    Falls back to Helvetica if the requested face/family is not available.
    """
    if requested and requested in _ALLOWED_FONTS:
        return requested
    if requested:
        fam = _derive_family_from_filename(requested) or requested
        if fam in _ALLOWED_FONTS:
            return fam
    return "Helvetica"


def _paragraph_style(base: ParagraphStyle, spec: ParagraphSpec) -> ParagraphStyle:
    style = ParagraphStyle(name="UserParagraph", parent=base)
    if spec.font_size_pt:
        style.fontSize = spec.font_size_pt
    if spec.leading_pt:
        style.leading = spec.leading_pt
    if spec.align == "center":
        style.alignment = 1
    elif spec.align == "right":
        style.alignment = 2
    elif spec.align == "justify":
        style.alignment = 4
    else:
        style.alignment = 0
    style.fontName = _safe_font_choice(spec.font_name)
    return style


def _image_flowable(im: ImageSpec) -> RLImage:
    if not im.b64:
        raise ValueError(
            "ImageSpec requires 'b64' (or provide 'name' resolvable via __files__)."
        )
    raw = base64.b64decode(im.b64)
    reader = ImageReader(io.BytesIO(raw))
    iw, ih = reader.getSize()
    target_w = im.width_inches * inch
    scale = target_w / float(iw)
    target_h = ih * scale
    return RLImage(io.BytesIO(raw), width=target_w, height=target_h)


def _table_flowable(t: TableSpec) -> Table:
    data = [[("" if v is None else v) for v in row] for row in t.rows]
    col_widths = None
    if t.col_widths_inches:
        col_widths = [w * inch for w in t.col_widths_inches]
    tbl = Table(data, colWidths=col_widths)
    ts = []
    if t.style_grid:
        ts.append(("GRID", (0, 0), (-1, -1), 0.5, colors.lightgrey))
    ts.extend(
        [
            ("LEFTPADDING", (0, 0), (-1, -1), 6),
            ("RIGHTPADDING", (0, 0), (-1, -1), 6),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ]
    )
    if t.header and len(data) >= 1:
        header_font = (
            "Inter-Bold" if "Inter-Bold" in _ALLOWED_FONTS else "Helvetica-Bold"
        )
        ts.extend(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.whitesmoke),
                ("FONTNAME", (0, 0), (-1, 0), header_font),
            ]
        )
    tbl.setStyle(TableStyle(ts))
    return tbl


def _create_pdf(instr: PdfInstructions) -> bytes:
    buf = io.BytesIO()
    pagesize = LETTER if instr.page_size == "LETTER" else A4
    left = instr.margins_inches.get("left", 1.0) * inch
    right = instr.margins_inches.get("right", 1.0) * inch
    top = instr.margins_inches.get("top", 1.0) * inch
    bottom = instr.margins_inches.get("bottom", 1.0) * inch

    doc = SimpleDocTemplate(
        buf,
        pagesize=pagesize,
        leftMargin=left,
        rightMargin=right,
        topMargin=top,
        bottomMargin=bottom,
        title=instr.title or "",
        author=instr.author or "",
        subject=instr.subject or "",
    )

    styles = getSampleStyleSheet()
    normal = styles["Normal"]

    story: List[Any] = []

    for p in instr.paragraphs:
        html = _wrap_text_with_inline_tags(p)
        pstyle = _paragraph_style(normal, p)
        story.append(Paragraph(html, pstyle))
        story.append(Spacer(1, 6))

    for im in instr.images:
        story.append(_image_flowable(im))
        story.append(Spacer(1, 8))

    for t in instr.tables:
        story.append(_table_flowable(t))
        story.append(Spacer(1, 10))

    if not story:
        story.append(Paragraph(" ", _paragraph_style(normal, ParagraphSpec(text=" "))))

    onpage = _make_onpage(instr.header_text, instr.footer_text, instr.show_page_numbers)
    doc.build(story, onFirstPage=onpage, onLaterPages=onpage)
    return buf.getvalue()


def _modify_pdf(existing: bytes, instr: PdfInstructions) -> bytes:
    """
    Basic 'modify' behavior: append newly generated pages to the end of the existing PDF.
    """
    new_bytes = (
        _create_pdf(instr)
        if (
            instr.paragraphs
            or instr.images
            or instr.tables
            or instr.title
            or instr.header_text
            or instr.footer_text
        )
        else b""
    )
    reader_old = PdfReader(io.BytesIO(existing))
    writer = PdfWriter()

    for page in reader_old.pages:
        writer.add_page(page)

    if new_bytes:
        reader_new = PdfReader(io.BytesIO(new_bytes))
        for page in reader_new.pages:
            writer.add_page(page)

    out = io.BytesIO()
    writer.write(out)
    return out.getvalue()


# ----------------------------
# File Upload Helper (FIXED - correct FileForm structure with tags)
# ----------------------------


def _upload_generated_file(
    file_bytes: bytes,
    filename: str,
    content_type: str,
    user_id: str,
    user_email: str,
    user_name: str,
) -> str:
    """
    Upload a generated file using Open WebUI's Storage provider and Files model.
    Returns the file ID for use in event emitter and URLs.

    This matches the exact structure used in open_webui/routers/files.py
    """
    # Generate unique file ID
    file_id = str(uuid.uuid4())

    # Create a unique storage filename to avoid collisions (matches router pattern)
    safe_filename = f"{file_id}_{filename}"

    # Build the tags dictionary (REQUIRED for S3StorageProvider)
    tags = {
        "OpenWebUI-User-Email": user_email,
        "OpenWebUI-User-Id": user_id,
        "OpenWebUI-User-Name": user_name,
        "OpenWebUI-File-Id": file_id,
    }

    # Upload to configured storage backend (local filesystem or S3)
    file_stream = io.BytesIO(file_bytes)
    contents, file_path = Storage.upload_file(file_stream, safe_filename, tags)

    # Create the file record in the database
    # IMPORTANT: FileForm structure must match what routers/files.py uses exactly
    file_form = FileForm(
        **{
            "id": file_id,
            "filename": filename,
            "path": file_path,  # TOP-LEVEL REQUIRED FIELD - not inside meta!
            "data": {},  # Required field, can be empty for generated files
            "meta": {
                "name": filename,
                "content_type": content_type,
                "size": len(file_bytes),
                "data": {"source": "pdf_document_tool"},
            },
        }
    )

    new_file = Files.insert_new_file(user_id, file_form)

    return new_file.id


# ----------------------------
# Main Tools class
# ----------------------------


class Tools:
    """
    Open WebUI tool entrypoint. Exposes `pdf_document_tool(...)`.

    This tool:
      - Validates inputs via Pydantic schemas
      - Registers modern fonts from attachments (TTF/OTF) when present
      - Creates / modifies PDF files (modify = append content to existing PDF)
      - Uploads the file using Storage provider and Files model (0.5.x+ compatible)
      - Emits a 'files' event with the returned file id
      - Returns a friendly status string including the download URL
    """

    class Valves(BaseModel):
        allow_server_paths: bool = Field(
            default=False,
            description="If True, allow reading from source_path on the server (admin only).",
        )
        show_progress: bool = Field(
            default=True,
            description="If True, emit status events during generation/upload.",
        )
        min_progress_delay_ms: int = Field(
            default=700,
            description="Minimal delay to keep status visible (milliseconds).",
        )

    def __init__(self):
        self.valves = self.Valves()
        self.citation = False
        self.file_handler = True  # Prevents default RAG processing of generated files

    async def _emit_status(
        self, __event_emitter__, text: str, done: bool = False
    ) -> None:
        if __event_emitter__ and self.valves.show_progress:
            await __event_emitter__(
                {
                    "type": "status",
                    "data": {"description": text, "done": done, "hidden": False},
                }
            )

    async def pdf_document_tool(
        self,
        file_type: FileType,
        operation: OperationType,
        instructions: Optional[Dict[str, Any]] = None,
        raw_instructions: Optional[Dict[str, Any]] = None,
        source_filename_hint: Optional[str] = None,
        source_path: Optional[str] = None,
        output_basename: Optional[str] = None,
        __files__: Optional[List[Dict[str, Any]]] = None,
        __event_emitter__=None,
        __user__: Optional[Dict[str, Any]] = None,
    ) -> str:
        """
        Create or modify PDF documents and attach them to the chat.
        """

        # Visible progress in the chat UI
        await self._emit_status(__event_emitter__, "Generating PDF…", done=False)
        if self.valves.min_progress_delay_ms > 0:
            await asyncio.sleep(self.valves.min_progress_delay_ms / 1000.0)

        try:
            # Register any attached modern fonts safely, then expand allowed font faces dynamically.
            registered_faces = _register_fonts_from_files(__files__)
            if registered_faces:
                _ALLOWED_FONTS.update(registered_faces)

            # Build validated params (coerce instructions)
            parsed = PdfToolParams(
                file_type=file_type,
                operation=operation,
                instructions=None,
                raw_instructions=raw_instructions or instructions or {},
                source_filename_hint=source_filename_hint,
                source_path=source_path,
                output_basename=output_basename,
            )

            # Coerce instructions
            payload = parsed.raw_instructions or {}
            instr_obj = PdfInstructions(**payload) if payload else PdfInstructions()

            # Resolve any image name -> bytes from __files__
            def resolve_images(images: List[ImageSpec]) -> List[ImageSpec]:
                if not images:
                    return images
                name_to_b64: Dict[str, str] = {}
                if __files__:
                    for f in __files__:
                        name = f.get("name") or f.get("filename")
                        if not name:
                            continue
                        if "content" in f and isinstance(f["content"], str):
                            try:
                                base64.b64decode(f["content"])
                                name_to_b64[name] = f["content"]
                            except Exception:
                                pass
                out: List[ImageSpec] = []
                for im in images:
                    if not im.b64 and im.name and im.name in name_to_b64:
                        out.append(
                            ImageSpec(
                                name=im.name,
                                b64=name_to_b64[im.name],
                                width_inches=im.width_inches,
                            )
                        )
                    else:
                        out.append(im)
                return out

            instr_obj.images = resolve_images(instr_obj.images)

            # Create or modify
            expected_ext = ".pdf"
            output_name = _choose_output_name(parsed.file_type, parsed.output_basename)

            if parsed.operation == "create":
                data_out = _create_pdf(instr_obj)
            else:
                existing_bytes: Optional[bytes] = None
                pick = _find_attached_file(
                    expected_ext, __files__ or [], parsed.source_filename_hint
                )
                if pick:
                    _, existing_bytes = pick

                if not existing_bytes and parsed.source_path:
                    if self.valves.allow_server_paths and os.path.isfile(
                        parsed.source_path
                    ):
                        with open(parsed.source_path, "rb") as fh:
                            existing_bytes = fh.read()
                    else:
                        raise PermissionError(
                            "Server path access is disabled. Attach the file to the chat or enable allow_server_paths."
                        )
                if not existing_bytes:
                    raise FileNotFoundError(
                        "No existing .pdf file found to modify. Attach a file or provide a valid source_path."
                    )

                data_out = _modify_pdf(existing_bytes, instr_obj)

            # Upload using Storage provider + Files model (0.5.x+ compatible)
            await self._emit_status(
                __event_emitter__, "Uploading attachment…", done=False
            )

            # Resolve user ID from __user__ dict
            user_id = __user__.get("id") if isinstance(__user__, dict) else None
            if not user_id:
                raise RuntimeError("No user context was provided for upload.")

            # Get full user object to access email and name for tags
            user_obj = Users.get_user_by_id(user_id)
            if not user_obj:
                raise RuntimeError(f"User not found with ID: {user_id}")

            # Get content type
            content_type = _get_content_type(parsed.file_type)

            # Upload file using the fixed helper function (with tags and correct FileForm)
            file_id = _upload_generated_file(
                file_bytes=data_out,
                filename=output_name,
                content_type=content_type,
                user_id=user_id,
                user_email=user_obj.email or "",
                user_name=user_obj.name or "",
            )

            # Build file URL (use relative path for compatibility)
            file_url = f"/api/v1/files/{file_id}/content"

            # Emit file attachment event (works in both Default and Native modes)
            if __event_emitter__:
                await __event_emitter__(
                    {
                        "type": "files",  # Use "files" for compatibility with both modes
                        "data": {
                            "files": [
                                {
                                    "type": "file",
                                    "id": file_id,
                                    "name": output_name,
                                    "url": file_url,
                                }
                            ]
                        },
                    }
                )
                await self._emit_status(__event_emitter__, "Done", done=True)

            # Final user-visible message with relative URL
            return (
                f"{parsed.operation.capitalize()}d PDF — "
                f"**{output_name}** is ready: [{output_name}]({file_url})"
            )

        except ValidationError as ve:
            if __event_emitter__:
                await __event_emitter__(
                    {
                        "type": "notification",
                        "data": {
                            "type": "error",
                            "content": f"Invalid inputs: {str(ve)}",
                        },
                    }
                )
            return _friendly_error("Input validation failed", ve)

        except PermissionError as pe:
            if __event_emitter__:
                await __event_emitter__(
                    {
                        "type": "notification",
                        "data": {"type": "warning", "content": str(pe)},
                    }
                )
            return _friendly_error("Permission error", pe)

        except FileNotFoundError as fe:
            if __event_emitter__:
                await __event_emitter__(
                    {
                        "type": "notification",
                        "data": {
                            "type": "warning",
                            "content": "No source file was found to modify.",
                        },
                    }
                )
            return _friendly_error("Missing source file", fe)

        except Exception as e:
            # Surface the actual error for debugging
            import traceback

            error_details = traceback.format_exc()
            if __event_emitter__:
                await __event_emitter__(
                    {
                        "type": "notification",
                        "data": {
                            "type": "error",
                            "content": f"PDF processing failed: {str(e)}",
                        },
                    }
                )
            # Return more detailed error for debugging
            return f"PDF processing failed: {type(e).__name__} — {str(e)}\n\nDetails:\n{error_details}"
