<?php

namespace App\Http\Api\Requests;

use App\User\Application\DTOs\UpdatePasswordDTO;
use Illuminate\Contracts\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class UpdatePasswordRequest extends FormRequest
{
    /**
     * @return array<string, Rule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'current_password' => ['required', 'string'],
            'password' => [
                'required',
                'string',
                'confirmed',
                Password::min(8)->letters()->mixedCase()->numbers(),
            ],
        ];
    }

    public function toDTO(): UpdatePasswordDTO
    {
        return new UpdatePasswordDTO(
            currentPassword: $this->string('current_password')->toString(),
            newPassword: $this->string('password')->toString()
        );
    }
}
