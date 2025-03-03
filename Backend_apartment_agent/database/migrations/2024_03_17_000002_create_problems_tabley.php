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
        Schema::create('problems', function (Blueprint $table) {
            $table->increments('id_problem');
            $table->string('content');
            $table->string('type')->nullable();
            $table->string('solve')->nullable();
            $table->string('user_card_id')->nullable(); // Foreign key to users
            $table->string('employee_card_id')->nullable(); // Foreign key to users
            $table->foreign('user_card_id')->references('id_card')->on('users')->onDelete('set null');
            $table->foreign('employee_card_id')->references('id_card')->on('employees')->onDelete('set null');
            $table->integer('permission');
            $table->timestamps();
            $table->softDeletes(); // This will create a 'deleted_at' column with nullable timestamps
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('problems');
    }
};
