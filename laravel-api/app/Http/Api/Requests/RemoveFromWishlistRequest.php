<?php

namespace App\Http\Api\Requests;

use App\User\Infrastructure\EloquentModels\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;

class RemoveFromWishlistRequest extends FormRequest
{
    public function authorize(): bool
    {
        $itemId = $this->route('id');
        $type = $this->input('wishlist_type');

        if (! $itemId || ! in_array($type, ['edition', 'box'])) {
            return false;
        }

        /** @var User $user */
        $user = $this->user();

        return DB::table('wishlist_items')
            ->where('user_id', $user->id)
            ->where('wishlistable_id', $itemId)
            ->where('wishlistable_type', $type)
            ->exists();
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'wishlist_type' => 'required|in:edition,box',
        ];
    }
}
