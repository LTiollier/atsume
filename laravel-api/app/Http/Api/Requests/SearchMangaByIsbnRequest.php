<?php

namespace App\Http\Api\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SearchMangaByIsbnRequest extends FormRequest
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
