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
        Schema::create('payments', function (Blueprint $table) {
            $table->increments('id_payment');
            $table->string('user_card_id')->nullable(); // Foreign key to users
            $table->string('employee_card_id')->nullable(); // Foreign key to employees
            $table->unsignedInteger('reservation_id')->nullable(); // Foreign key to employees
            $table->unsignedInteger('apartment_id')->nullable();
            $table->foreign('user_card_id')->references('id_card')->on('users')->onDelete('set null');
            $table->foreign('employee_card_id')->references('id_card')->on('employees')->onDelete('set null');
            $table->foreign('reservation_id')->references('id_reservation')->on('reservations')->onDelete('set null');
            $table->foreign('apartment_id')->references('id_apartment')->on('apartments')->onDelete('set null');
            $table->integer('price');
            $table->boolean('status_user');
            $table->boolean('status_employee');
            $table->timestamps();
            $table->softDeletes(); // This will create a 'deleted_at' column with nullable timestamps
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
