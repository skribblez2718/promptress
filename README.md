# Promptress

A curated collection of system prompts and shortcut templates for use with Open WebUI and other AI chat interfaces.

## What Makes These Prompts Different

All prompts in this collection integrate **advanced reasoning methodologies** to enhance AI reliability and output quality:

- **Johari Window Discovery Protocol** - Structured clarification framework that maps knowledge gaps (what you know, what I know, what we both don't know) before generation
- **Chain-of-Thought Reasoning** - Explicit step-by-step problem decomposition
- **Tree-of-Thoughts Exploration** - Multi-path solution evaluation with trade-off analysis
- **Self-Consistency Verification** - Cross-validation across multiple reasoning chains
- **Constitutional Self-Critique** - Internal revision cycles against accuracy, completeness, and safety principles
- **Verification Requirements** - Confidence scoring, source verification, and explicit assumption declarations to minimize hallucinations

These prompts prioritize **discovery before generation** - ensuring clarity through systematic questioning rather than making assumptions.

---

## XML Versions for Claude

All system prompts in the `system_prompts/` directory are available in two formats:

- **Standard format** (`.md` files) - Traditional markdown format with section headers
- **XML format** (`_claude.xml` files) - Structured with XML tags optimized for Claude's prompt engineering best practices as per their documentation

The XML versions use semantic tags like `<role>`, `<objective>`, `<reasoning_protocol>`, `<instructions>`, `<verification_requirements>`, and others to create a hierarchical structure that Claude can parse more effectively. Both versions contain identical content - choose based on your preference and the AI model you're using.

Example: `prompt_improver.md` has a corresponding `prompt_improver_claude.xml` with XML structure.

---

## System Prompts

Full-featured system prompts designed for AI assistants with comprehensive reasoning and verification protocols.

### Agent Description Generator
An expert system prompt engineer specializing in AI agent architecture. Transforms high-level agent purposes into comprehensive, single-purpose system prompts for multi-agent systems, ensuring narrow scope, reliability, and optimal performance with clear boundaries and interaction protocols.

### AI Tutor Generator
Create personalized AI tutor assistants for adult learners and professionals. This prompt helps generate complete system prompts for AI tutors on any topic, complete with subtopics and prerequisites, using discovery-driven clarification methodology.

### Blog Assistant
**SecBlogRefiner** - Technical blog editing specialist for cybersecurity content. Preserves author voice while ensuring safety and accuracy. Includes voice-accuracy conflict resolution protocol and comprehensive fact-checking workflows.

### MCP Generator
An expert Python developer and software architect specializing in secure, production-ready MCP (Model Context Protocol) server implementation. Generates complete, modular, well-tested MCP servers with factory method patterns, comprehensive security practices (>80% test coverage), deployment artifacts (systemd services), and detailed documentation. Uses advanced reasoning protocols (Chain-of-Thought, Tree-of-Thoughts, Self-Consistency) to ensure production-ready code with no skeleton implementations. Enforces strict validation of 6 required inputs including API documentation as a critical blocker.

### Cybersecurity Bot
A specialized assistant for cybersecurity professionals, providing guidance on security best practices, vulnerability assessment, and secure coding techniques. Integrates full reasoning architecture with security-specific verification protocols.

### Prompt Improver
A prompt-engineering expert that refines user-provided prompts into effective system prompts. **PRIMARY FOCUS:** Discovery-driven clarification using Johari Window before refinement.

### Python Coding Assistant
An expert Python development assistant with deep knowledge of type hinting (PEP 484, 526), Google-style docstring writing (PEP 257), and code review. Specializes in enhancing code with proper type annotations and following Python best practices with full reasoning protocols for code analysis.

### System Prompt Evaluator
**PromptEvaluatorX** - QA for system prompts with reliability-first approach (determinism, error handling, graceful degradation). Features weighted scoring system and comprehensive acceptance testing framework. Analyzes and improves existing system prompts for clarity, effectiveness, and safety.

### System Prompt Generator
Expert prompt-engineering system that turns clear user briefs into concise, testable system prompts. **PRIMARY FOCUS:** Discovery-driven clarification using Johari Window framework. Uses GOLDEN framework (Goal, Output, Limits, Data, Evaluation, Next) and outputs in plain text code blocks for easy copying.

### TELOS Assistant
**Based on Daniel Miessler's TELOS project** - A personal AI life coach and accountability partner that provides clear, empathetic, and practical guidance grounded in the user's TELOS context file. Supports values alignment, habit formation, reflection, and sound decision-making with RAG-based context retrieval and comprehensive crisis response protocols.

### TELOS File Generator
**Based on Daniel Miessler's TELOS project** - Facilitates creation of TELOS context files through structured section-by-section questioning. Processes Background, Values, Problems, Mission, Narratives, Goals, Challenges, Metrics, Events, and Journal sections with confirmation workflow at each step.

---

## Shortcut Prompts

Quick-use templates with placeholder variables for rapid AI interactions.

### Create System Prompt
Template for crafting new system prompts with proper structure and safety considerations. Optimized for specific AI models (`{{MODEL}}`) based on requirements in `{{PROMPT}}`.

### Evaluate Prompt
Analyze and provide feedback on existing prompts to improve their effectiveness. Template evaluates `{{PROMPT}}` for use with `{{MODEL}}` using comprehensive evaluation framework.

### Improve Code
Get suggestions for enhancing code quality, performance, and readability. Accepts code in any programming language with language-specific optimization recommendations.

### Improve Prompt
Refine and optimize existing prompts for better AI responses. Template-based approach for systematic prompt enhancement optimized for `{{MODEL}}`.

### Think Hard
Comprehensive reasoning protocol shortcut that activates Johari Window knowledge mapping + advanced reasoning techniques (Chain-of-Thought, Tree-of-Thoughts, Self-Consistency, Constitutional checks). Use when you need the AI to apply rigorous multi-path reasoning and challenge assumptions before responding.
