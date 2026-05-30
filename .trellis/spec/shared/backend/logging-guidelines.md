# Logging Guidelines

> Not applicable for `@myshop/shared`.

---

## Overview

This package contains types and validators only — no logging.

Application logging happens in `@myshop/api` (NestJS Logger) and optionally in `@myshop/web` (client console avoided in production).

Do not add loggers to shared utilities.
