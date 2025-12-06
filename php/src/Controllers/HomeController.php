<?php

namespace SkyzerCloud\Controllers;

use SkyzerCloud\Core\View;

class HomeController
{
    public function index(): void
    {
        View::render('home/index');
    }
}

