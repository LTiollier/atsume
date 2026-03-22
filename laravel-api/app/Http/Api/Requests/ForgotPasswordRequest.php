<?php

declare(strict_types=1);

namespace App\Http\Api\Requests;

use App\User\Application\DTOs\ForgotPasswordDTO;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ForgotPasswordRequest extends FormRequest
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
            'email' => 'required|email|exists:users,email',
        ];
    }

    public function toDTO(): ForgotPasswordDTO
    {
        /** @var string $email */
        $email = $this->validated('email');

        return new ForgotPasswordDTO(
            email: $email
        );
    }
}
