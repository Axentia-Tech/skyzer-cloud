<?php

namespace SkyzerCloud\Controllers;

use SkyzerCloud\Core\View;
use SkyzerCloud\Models\Product;

class PricingController
{
    public function index(): void
    {
        $productModel = new Product();
        $products = $productModel->getAll();
        
        View::render('pricing/index', ['products' => $products]);
    }
}

