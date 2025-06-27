<?php 
header('Content-Type: application/json');

$user = 'root';
$pass = '';

try {
    $dbh = new PDO('mysql:host=localhost;dbname=base_test;charset=utf8', $user, $pass);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sth = $dbh->query('SELECT * FROM notes');
    echo json_encode($sth->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['titre'], $data['contenu'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Champs manquants']);
        exit;
    }

    $stmt = $dbh->prepare('INSERT INTO notes (titre, contenu) VALUES (?, ?)');
    $stmt->execute([$data['titre'], $data['contenu']]);

    echo json_encode(['success' => true]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true); // il manque le `true`

    if (!isset($data['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'note non retrouvée']); // c'était json-encode (erreur de syntaxe)
        exit;
    }

    $stmt = $dbh->prepare('DELETE FROM notes WHERE id = ?');
    $stmt->execute([$data['id']]); // appel correct avec tableau

    echo json_encode(['success' => true]);
    exit;
}

if($_SERVER['REQUEST_METHOD'] ==='PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    if(!isset($data['id'])){
        http_response_code(400);
        echo json_encode(['error' => 'note non retrouvée']);
        exit;
    }

    $stmt = $dbh -> prepare('UPDATE notes SET titre=?, contenu=? where id =?');
    $stmt -> execute([$data['titre'], $data['contenu'], $data['id']]);

    echo json_encode(['success' => true]);
}
?>
