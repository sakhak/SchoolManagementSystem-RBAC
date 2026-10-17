<?php

namespace App\Http\Controllers;

use App\Models\BlackList;
use Illuminate\Http\Request;

class BlackListController extends Controller
{
    public function index(Request $request)
    {
        $list = BlackList::with('student.user', 'term')
            ->when($request->query('term_id'), fn ($q, $v) => $q->where('term_id', $v))
            ->orderByDesc('absences_count')
            ->get();

        return response()->json([
            'data' => $list,
            'threshold' => (int) config('school.absence_threshold'),
        ]);
    }

    /** POST /blacklist/recalculate { term_id } */
    public function recalculate(Request $request)
    {
        $validated = $request->validate(['term_id' => ['required', 'exists:terms,id']]);
        AttendanceController::recalculateBlackList((int) $validated['term_id']);

        return $this->index($request->merge(['term_id' => $validated['term_id']]));
    }

    public function destroy(string $id)
    {
        BlackList::findOrFail($id)->delete();

        return response()->json(['message' => 'Removed from blacklist']);
    }
}
