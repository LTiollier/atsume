<?php

namespace App\Http\Api\Requests;

use App\User\Application\DTOs\LoginDTO;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    public function toDTO(): LoginDTO
    {
        return new LoginDTO(
            email: $this->string('email')->toString(),
            password: $this->string('password')->toString(),
        );
    }
}
