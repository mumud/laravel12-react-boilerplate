<?php

namespace App\Http\Requests\Organizations;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCompanyRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:50', 'unique:companies,code,' . $this->route('company')->id],
            'address' => ['nullable', 'string'],
            'domain' => ['nullable', 'string'],
            'date_of_establishment' => ['required', 'date'],
        ];
    }
}
