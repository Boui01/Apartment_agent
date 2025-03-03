<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->string('id_card')->primary();
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
            $table->string('bank_id')->nullable(); 
            $table->foreign('bank_id')->references('id_bank')->on('banks')->onDelete('set null');
            $table->integer('financial_statement');
            $table->string('guarantor_english_fname');
            $table->string('guarantor_english_lname'); 
            $table->string('guarantor_address');
            $table->string('guarantor_phone');   
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamp('user_create')->useCurrent();
            $table->timestamp('last_login')->useCurrent();
            $table->string('password');
            $table->rememberToken();
            $table->softDeletes(); // This will create a 'deleted_at' column with nullable timestamps
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
