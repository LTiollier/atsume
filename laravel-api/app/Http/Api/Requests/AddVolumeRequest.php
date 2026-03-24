<?php

declare(strict_types=1);

namespace App\Http\Api\Requests;

use App\Manga\Application\DTOs\AddVolumeDTO;
use App\User\Infrastructure\EloquentModels\User;
use Illuminate\Foundation\Http\FormRequest;

class AddVolumeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'api_id' => ['required', 'string'],
        ];
    }

    public function toDTO(): AddVolumeDTO
    {
        /** @var User $user */
        $user = $this->user();

        return new AddVolumeDTO(
            api_id: $this->string('api_id')->toString(),
            userId: (int) $user->id
        );
    }
}
