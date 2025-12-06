<?php

namespace SkyzerCloud\Core;

class Validator
{
    private array $errors = [];
    private array $data = [];

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    public function required(string $field, string $message = null): self
    {
        if (empty($this->data[$field] ?? null)) {
            $this->errors[$field] = $message ?? "{$field} is required";
        }
        return $this;
    }

    public function email(string $field, string $message = null): self
    {
        if (!filter_var($this->data[$field] ?? '', FILTER_VALIDATE_EMAIL)) {
            $this->errors[$field] = $message ?? "{$field} must be a valid email";
        }
        return $this;
    }

    public function min(string $field, int $length, string $message = null): self
    {
        if (strlen($this->data[$field] ?? '') < $length) {
            $this->errors[$field] = $message ?? "{$field} must be at least {$length} characters";
        }
        return $this;
    }

    public function max(string $field, int $length, string $message = null): self
    {
        if (strlen($this->data[$field] ?? '') > $length) {
            $this->errors[$field] = $message ?? "{$field} must be at most {$length} characters";
        }
        return $this;
    }

    public function matches(string $field, string $field2, string $message = null): self
    {
        if (($this->data[$field] ?? '') !== ($this->data[$field2] ?? '')) {
            $this->errors[$field] = $message ?? "{$field} does not match {$field2}";
        }
        return $this;
    }

    public function fails(): bool
    {
        return !empty($this->errors);
    }

    public function errors(): array
    {
        return $this->errors;
    }

    public function firstError(): ?string
    {
        return !empty($this->errors) ? reset($this->errors) : null;
    }
}

