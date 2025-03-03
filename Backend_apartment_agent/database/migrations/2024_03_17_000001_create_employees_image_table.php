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
        Schema::create('employees_image', function (Blueprint $table) {
            $table->increments('id_employee_image');
            $table->string('employee_card_id')->nullable(); // Add the column first
            $table->foreign('employee_card_id')->references('id_card')->on('employees')->onDelete('set null');
            $table->binary('image');
            $table->timestamps();
            $table->softDeletes(); // This will create a 'deleted_at' column with nullable timestamps
        });


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_image');
    }
};