<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->string('id_card')->primary();
            $table->string('thai_fname',30);
            $table->string('thai_lname',30);
            $table->string('english_fname',30);
            $table->string('english_lname',30);
            $table->string('address');
            $table->date('birthday');
            $table->string('religion');
            $table->string('sex',10);
            $table->integer('age');
            $table->string('phone',10);
            $table->string('line_id');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamp('employee_create')->useCurrent();
            $table->timestamp('last_login')->useCurrent();
            $table->string('password');
            $table->rememberToken();
            $table->softDeletes(); // This will create a 'deleted_at' column with nullable timestamps
        });

        DB::table('employees')->insert([
            'id_card' => 0,
            'thai_fname' => 'Thai Fadmin',
            'thai_lname' => 'Thai Ladminn',
            'english_fname' => 'English Fadmin',
            'english_lname' => 'English Ladminn',
            'address' => 'Demo 123',
            'birthday' => '1990-01-01',
            'age' => 99,
            'religion' => 'Demo',
            'sex' => 'Demo',
            'phone' => '1234567890',
            'line_id' => '1234567890',
            'email' => 'Employee_0@gmail.com',
            'email_verified_at' => date('Y-m-d H:i:s'),
            'employee_create' => date('Y-m-d H:i:s'),
            'last_login' => date('Y-m-d H:i:s'),
            'password' => Hash::make('0123456789'),
            'deleted_at' => null

        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
