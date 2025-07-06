<?php

namespace App\Http\Requests\Organizations;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDepartmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('department.update');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string'],
            'code' => [
                'required',
                'string',
                Rule::unique('departments', 'code')->ignore($this->route('department')),
            ],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'in:active,inactive'],
        ];
    }
}
