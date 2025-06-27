<?php

namespace Modules\Organization\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCompanyRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:50', 'unique:companies,code'],
            'address' => ['nullable', 'string'],
            'domain' => ['nullable', 'string'],
            'date_of_establishment' => ['required', 'date'],
        ];
    }
}
