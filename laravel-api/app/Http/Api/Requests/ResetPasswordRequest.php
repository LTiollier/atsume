<?php

declare(strict_types=1);

namespace App\Http\Api\Requests;

use App\User\Application\DTOs\ResetPasswordDTO;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ResetPasswordRequest extends FormRequest
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
            'token' => 'required',
            'email' => 'required|email|exists:users,email',
            'password' => 'required|min:8|confirmed',
        ];
    }

    public function toDTO(): ResetPasswordDTO
    {
        /** @var string $email */
        $email = $this->validated('email');

        /** @var string $password */
        $password = $this->validated('password');

        /** @var string $passwordConfirmation */
        $passwordConfirmation = $this->input('password_confirmation');

        /** @var string $token */
        $token = $this->validated('token');

        return new ResetPasswordDTO(
            email: $email,
            password: $password,
            passwordConfirmation: $passwordConfirmation,
            token: $token
        );
    }
}
