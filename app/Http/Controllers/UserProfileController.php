<?php

namespace App\Http\Controllers;

use App\Models\UserProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userProfile = UserProfile::all();
        return response()->json([
            'data' => $userProfile
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
         $validated = $request->validate([
        'first_name' => ['nullable', 'string'],
        'last_name' => ['nullable', 'string'],
        'gender' => ['nullable', 'string'],
        'date_of_birth' => ['nullable', 'date'],
        'phone_number' => ['nullable', 'string'],
        'email' => ['nullable', 'email'],
        'address' => ['nullable', 'string'],
        'city' => ['nullable', 'string'],
        'province' => ['nullable', 'string'],
        'country' => ['nullable', 'string'],
        'profile_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
        'guardian_name' => ['nullable', 'string'],
        'guardian_phone' => ['nullable', 'string'],
        'emergency_contact' => ['nullable', 'string'],
        'bio' => ['nullable', 'string'],
    ]);
     $validated['user_id']=Auth::id();

       if ($request->hasFile('profile_image')) {
        $validated['profile_image'] = $request
            ->file('profile_image')
            ->store('profile_images', 'public');
    }

    $profile = UserProfile::create($validated);


    return response()->json([
        "data" => $profile,
        "message" => "User profile created successfully!"
    ]);

    }
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
