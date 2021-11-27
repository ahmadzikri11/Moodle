$event = \core\event\dashboard_viewed::create($eventparams);
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
    <style media="screen">
      
    </style>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
  </head>
  <body>
    <header>
      
    </header>
     <div class="card" style="width: 18rem;">
  <img src="..." class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">Card title</h5>
            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            <a href="#" class="btn btn-primary">Go somewhere</a>
        </div>
    </div>
    </div>
    
  </body>
</html>

<?php
require_once(__DIR__ . '/../config.php');
require_once($CFG->dirroot . '/my/lib.php');
$event = \core\event\dashboard_viewed::create($eventparams);
?>