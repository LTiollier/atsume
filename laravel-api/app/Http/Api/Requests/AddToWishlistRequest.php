<?php

declare(strict_types=1);

namespace App\Http\Api\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddToWishlistRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'wishlist_id' => ['required', 'integer'],
            'wishlist_type' => ['required', 'in:edition,box'],
        ];
    }
}
