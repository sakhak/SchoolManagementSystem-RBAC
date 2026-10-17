<?php

namespace App\Http\Controllers;

use App\Models\Term;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TermController extends Controller
{
    public function index(Request $request)
    {
        $terms = Term::with('academicYear')
            ->when($request->query('academic_year_id'), fn ($q, $v) => $q->where('academic_year_id', $v))
            ->orderByDesc('start_date')
            ->get();

        return response()->json(['data' => $terms]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:terms,name'],
            'academic_year_id' => ['required', 'exists:academic_years,id'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
        ]);

        return response()->json([
            'data' => Term::create($validated)->load('academicYear'),
            'message' => 'Term created successfully',
        ], 201);
    }

    public function show(string $id)
    {
        return response()->json(['data' => Term::with('academicYear')->findOrFail($id)]);
    }

    public function update(Request $request, string $id)
    {
        $term = Term::findOrFail($id);
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('terms', 'name')->ignore($term->id)],
            'academic_year_id' => ['sometimes', 'required', 'exists:academic_years,id'],
            'start_date' => ['sometimes', 'required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
        ]);
        $term->update($validated);

        return response()->json(['data' => $term->load('academicYear'), 'message' => 'Term updated successfully']);
    }

    public function destroy(string $id)
    {
        Term::findOrFail($id)->delete();

        return response()->json(['message' => 'Term deleted successfully']);
    }
}
