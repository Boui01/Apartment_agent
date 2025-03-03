<?php

namespace App\Console\Commands;

use App\Models\Base\Bank\Bank;
use App\Models\Base\User\ImageUser;
use App\Models\Base\VerificationTokens\VerificationTokens;
use Illuminate\Console\Command;
use App\Models\Base\User\User;
use Carbon\Carbon;

class DeleteExpiredEmailTokens extends Command
{
    protected $signature = 'email-tokens:delete-expired';
    protected $description = 'Delete email verification tokens older than 1 hour for unverified users.';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        // Define the expiration time (1 hour ago)
        $expirationTime = Carbon::now()->subHour();

        // Find users with unverified emails and tokens created more than 1 hour ago
        $tokens = VerificationTokens::where('created_at','<', $expirationTime)->get();

        // Loop through each user and delete their email verification token
        foreach ($tokens as $token) {
            $user = User::where('email', $token->email)->first();
            $bank = Bank::where('id_bank', $user->bank_id)->first();
            $image = ImageUser::where('user_card_id', $user->id_card)->first();
            if ($user && $user->email_verified_at == null && $bank && $image && $token) {
                $user->delete();
                $bank->delete();
                $image->delete();
                $token->delete();
            }
            else{
                $token->delete();
                $this->info('Some data dont exist.'.$user->id_card.$bank->id_bank.$image->user_card_id.$token->email);
            }
        }

        $this->info('Expired email verification tokens deleted successfully.');
    }
}
