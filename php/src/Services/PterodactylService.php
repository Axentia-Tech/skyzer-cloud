<?php

namespace SkyzerCloud\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;

class PterodactylService
{
    private Client $client;
    private string $baseUrl;
    private string $apiKey;

    public function __construct()
    {
        $this->baseUrl = rtrim($_ENV['PTERODACTYL_URL'] ?? '', '/');
        $this->apiKey = $_ENV['PTERODACTYL_API_KEY'] ?? '';
        
        $this->client = new Client([
            'base_uri' => $this->baseUrl . '/api/application/',
            'headers' => [
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ],
            'timeout' => 30,
        ]);
    }

    public function createUser(string $email, string $username, string $firstName, string $lastName): ?array
    {
        try {
            $response = $this->client->post('users', [
                'json' => [
                    'email' => $email,
                    'username' => $username,
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'root_admin' => false,
                ],
            ]);

            return json_decode($response->getBody()->getContents(), true);
        } catch (GuzzleException $e) {
            error_log("Pterodactyl createUser error: " . $e->getMessage());
            return null;
        }
    }

    public function createServer(array $config): ?array
    {
        try {
            $response = $this->client->post('servers', [
                'json' => [
                    'name' => $config['name'],
                    'user' => $config['user_id'],
                    'egg' => $config['egg_id'],
                    'docker_image' => $config['docker_image'] ?? 'ghcr.io/pterodactyl/games:java',
                    'startup' => $config['startup'] ?? 'java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar {{SERVER_JARFILE}}',
                    'environment' => $config['environment'] ?? [],
                    'limits' => [
                        'memory' => $config['memory'],
                        'swap' => 0,
                        'disk' => $config['disk'],
                        'io' => 500,
                        'cpu' => $config['cpu'] ?? 100,
                    ],
                    'feature_limits' => [
                        'databases' => $config['databases'] ?? 0,
                        'backups' => $config['backups'] ?? 0,
                        'allocations' => 1,
                    ],
                    'allocation' => [
                        'default' => $config['allocation_id'] ?? null,
                    ],
                ],
            ]);

            return json_decode($response->getBody()->getContents(), true);
        } catch (GuzzleException $e) {
            error_log("Pterodactyl createServer error: " . $e->getMessage());
            return null;
        }
    }

    public function getServer(int $serverId): ?array
    {
        try {
            $response = $this->client->get("servers/{$serverId}");
            return json_decode($response->getBody()->getContents(), true);
        } catch (GuzzleException $e) {
            error_log("Pterodactyl getServer error: " . $e->getMessage());
            return null;
        }
    }

    public function deleteServer(int $serverId): bool
    {
        try {
            $this->client->delete("servers/{$serverId}");
            return true;
        } catch (GuzzleException $e) {
            error_log("Pterodactyl deleteServer error: " . $e->getMessage());
            return false;
        }
    }

    public function getPanelUrl(): string
    {
        return $this->baseUrl;
    }
}

