<?php

declare(strict_types=1);

namespace App\Http\Api\Requests;

use App\Manga\Application\DTOs\ScanBulkVolumeDTO;
use App\User\Infrastructure\EloquentModels\User;
use Illuminate\Foundation\Http\FormRequest;

class ScanBulkVolumeRequest extends FormRequest
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
            'isbns' => ['required', 'array', 'min:1'],
            'isbns.*' => ['required', 'string'],
        ];
    }

    public function toDTO(): ScanBulkVolumeDTO
    {
        /** @var User $user */
        $user = $this->user();

        /** @var array<string> $isbns */
        $isbns = $this->input('isbns', []);

        return new ScanBulkVolumeDTO(
            isbns: $isbns,
            userId: (int) $user->id
        );
    }
}
