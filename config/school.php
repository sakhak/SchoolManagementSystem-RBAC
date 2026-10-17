<?php

return [
    // A student is blacklisted for a term when their 'absent' count reaches this number.
    'absence_threshold' => (int) env('SCHOOL_ABSENCE_THRESHOLD', 3),

    // Seeded super admin (change these in .env for any real deployment!)
    'super_admin' => [
        'name' => env('SUPER_ADMIN_NAME', 'Super Admin'),
        'email' => env('SUPER_ADMIN_EMAIL', 'superadmin@gmail.com'),
        'password' => env('SUPER_ADMIN_PASSWORD', '12345678'),
    ],
];
