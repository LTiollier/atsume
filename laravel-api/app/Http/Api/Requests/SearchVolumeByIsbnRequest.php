<?php

declare(strict_types=1);

namespace App\Http\Api\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SearchVolumeByIsbnRequest extends FormRequest
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
            'isbn' => ['required', 'string'],
        ];
    }
}
