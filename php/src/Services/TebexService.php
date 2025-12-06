<?php

namespace SkyzerCloud\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;

class TebexService
{
    private Client $client;
    private string $secretKey;
    private string $publicKey;

    public function __construct()
    {
        $this->secretKey = $_ENV['TEBEX_SECRET_KEY'] ?? '';
        $this->publicKey = $_ENV['TEBEX_PUBLIC_KEY'] ?? '';
        
        $this->client = new Client([
            'base_uri' => 'https://plugin.tebex.io/',
            'headers' => [
                'X-Tebex-Secret' => $this->secretKey,
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ],
            'timeout' => 30,
        ]);
    }

    public function createCheckout(array $items, string $returnUrl, string $username): ?string
    {
        try {
            // Tebex API endpoint may vary - adjust based on your Tebex setup
            // This is a simplified version - you may need to use Tebex Headless API or Webstore API
            $response = $this->client->post('checkout', [
                'json' => [
                    'username' => $username,
                    'items' => $items,
                    'return_url' => $returnUrl,
                ],
            ]);

            $data = json_decode($response->getBody()->getContents(), true);
            
            // Return checkout URL - adjust based on actual Tebex API response
            if (isset($data['url'])) {
                return $data['url'];
            } elseif (isset($data['checkout_url'])) {
                return $data['checkout_url'];
            } elseif (isset($data['data']['url'])) {
                return $data['data']['url'];
            }
            
            // Fallback: construct URL from package ID if available
            if (!empty($items[0]['package'])) {
                $packageId = $items[0]['package'];
                // This is a placeholder - adjust to your actual Tebex store URL
                return "https://yourstore.tebex.io/checkout/packages/{$packageId}";
            }
            
            return null;
        } catch (GuzzleException $e) {
            error_log("Tebex createCheckout error: " . $e->getMessage());
            return null;
        }
    }

    public function verifyWebhook(string $payload, string $signature): bool
    {
        $expectedSignature = hash_hmac('sha256', $payload, $this->secretKey);
        return hash_equals($expectedSignature, $signature);
    }

    public function getPackage(int $packageId): ?array
    {
        try {
            $response = $this->client->get("packages/{$packageId}");
            return json_decode($response->getBody()->getContents(), true);
        } catch (GuzzleException $e) {
            error_log("Tebex getPackage error: " . $e->getMessage());
            return null;
        }
    }
}

