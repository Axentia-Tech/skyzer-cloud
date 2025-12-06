<?php

namespace SkyzerCloud\Controllers;

use SkyzerCloud\Core\View;
use SkyzerCloud\Core\Auth;
use SkyzerCloud\Core\Validator;
use SkyzerCloud\Models\User;
use SkyzerCloud\Services\PterodactylService;

class AuthController
{
    public function showLogin(): void
    {
        if (Auth::check()) {
            View::redirect('/dashboard');
            return;
        }
        View::render('auth/login');
    }

    public function login(): void
    {
        $validator = new Validator($_POST);
        $validator->required('email')->email('email');
        $validator->required('password');

        if ($validator->fails()) {
            View::render('auth/login', ['errors' => $validator->errors()]);
            return;
        }

        $userModel = new User();
        $user = $userModel->findByEmail($_POST['email']);

        if (!$user || !$userModel->verifyPassword($_POST['password'], $user['password_hash'])) {
            View::render('auth/login', ['error' => 'Invalid email or password']);
            return;
        }

        Auth::login($user['id'], $user['email']);
        View::redirect('/dashboard');
    }

    public function showRegister(): void
    {
        if (Auth::check()) {
            View::redirect('/dashboard');
            return;
        }
        View::render('auth/register');
    }

    public function register(): void
    {
        $validator = new Validator($_POST);
        $validator->required('email')->email('email');
        $validator->required('password')->min('password', 8);
        $validator->required('first_name');
        $validator->required('last_name');

        if ($validator->fails()) {
            View::render('auth/register', ['errors' => $validator->errors()]);
            return;
        }

        $userModel = new User();
        
        // Check if user already exists
        if ($userModel->findByEmail($_POST['email'])) {
            View::render('auth/register', ['error' => 'Email already registered']);
            return;
        }

        // Create user in database
        $userId = $userModel->create([
            'email' => $_POST['email'],
            'password' => $_POST['password'],
            'first_name' => $_POST['first_name'],
            'last_name' => $_POST['last_name'],
        ]);

        if (!$userId) {
            View::render('auth/register', ['error' => 'Registration failed. Please try again.']);
            return;
        }

        // Create user in Pterodactyl
        $pteroService = new PterodactylService();
        $username = strtolower($_POST['first_name'] . $_POST['last_name']);
        $pteroUser = $pteroService->createUser(
            $_POST['email'],
            $username,
            $_POST['first_name'],
            $_POST['last_name']
        );

        if ($pteroUser) {
            $userModel->updatePterodactylInfo(
                $userId,
                $pteroUser['attributes']['id'],
                $username
            );
        }

        Auth::login($userId, $_POST['email']);
        View::redirect('/dashboard');
    }

    public function logout(): void
    {
        Auth::logout();
        View::redirect('/');
    }
}

