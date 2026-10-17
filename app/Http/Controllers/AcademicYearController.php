<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AcademicYearController extends Controller
{
    public function index()
    {
        return response()->json(['data' => AcademicYear::with('terms')->orderByDesc('start_date')->get()]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:academic_years,name'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
        ]);

        return response()->json([
            'data' => AcademicYear::create($validated),
            'message' => 'Academic year created successfully',
        ], 201);
    }

    public function show(string $id)
    {
        return response()->json(['data' => AcademicYear::with('terms')->findOrFail($id)]);
    }

    public function update(Request $request, string $id)
    {
        $year = AcademicYear::findOrFail($id);
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('academic_years', 'name')->ignore($year->id)],
            'start_date' => ['sometimes', 'required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
        ]);
        $year->update($validated);

        return response()->json(['data' => $year, 'message' => 'Academic year updated successfully']);
    }

    public function destroy(string $id)
    {
        AcademicYear::findOrFail($id)->delete();

        return response()->json(['message' => 'Academic year deleted successfully']);
    }
}
