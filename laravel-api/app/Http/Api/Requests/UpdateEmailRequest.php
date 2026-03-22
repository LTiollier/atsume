<?php

declare(strict_types=1);

namespace App\Http\Api\Requests;

use App\User\Application\DTOs\UpdateEmailDTO;
use Illuminate\Foundation\Http\FormRequest;

class UpdateEmailRequest extends FormRequest
{
    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'email' => [
                'required',
                'email',
                'unique:users,email,'.$this->user()?->id,
            ],
            'current_password' => ['required', 'string'],
        ];
    }

    public function toDTO(): UpdateEmailDTO
    {
        return new UpdateEmailDTO(
            email: $this->string('email')->toString(),
            currentPassword: $this->string('current_password')->toString()
        );
    }
}
