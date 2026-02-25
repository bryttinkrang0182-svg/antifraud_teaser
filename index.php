<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Ecobank Anti-Fraud Teaser</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
  <link rel="stylesheet" href="styles.css">

  <!-- Preload heavy side images for instant rendering on page transition -->
  <link rel="preload" href="images/benz.png" as="image">
  <link rel="preload" href="images/wagadri_man.png" as="image">
  <link rel="preload" href="images/ECOBANK_WRONG_LOGO.png" as="image">
</head>
<body>

<!-- PAGE 1 – FORM PAGE -->
<section id="page1" class="page active">


  <div class="card">
    <h1>REDEEM YOUR GHS 500 CASHBACK HERE</h1>
    <p>Please enter your details below to continue.</p>

    <form id="userForm">
      <input type="text" id="name" name="name" placeholder="Full Name" required>
      <input type="email" id="email" name="email" placeholder="Email Address" required>
      <input type="tel" id="phone" name="phone" placeholder="Phone Number" required>
      <div class="date-group">
        <input type="date" id="dateOfBirth" name="dateOfBirth" required>
        <span class="date-placeholder">Date of Birth</span>
      </div>
      <input type="text" id="lastFourDigits" name="lastFourDigits" placeholder="Last 4 digits of your Ghana Card Number" required>

      <button type="submit">SUBMIT</button>
    </form>
  </div>
</section>


<!-- PAGE 2 – VICTIM COUNT PAGE (full-screen counter) -->
<section id="page2" class="page">
  <div class="count-wrap">
    <img src="images/ECOBANK_WRONG_LOGO.png" alt="Logo" class="page-logo">
    <img src="images/benz.png" alt="Car" class="side-image left">
    <img src="images/wagadri_man.png" alt="Man" class="side-image right">
    <h1 id="victimTitle">Welcome</h1>
    <p id="victimSub">Victim No.</p>
    <p id="victimName" class="victim-name"></p>

    <div class="tiles" id="victimTiles" aria-hidden="false"></div>

    <div class="count-actions">
      <!-- Proceed button removed — page will show loader then count -->
    </div>
  </div>
</section>

<!-- Loader (hidden by default) -->
<div id="loaderOverlay" class="loader-overlay" aria-hidden="true">
  <div class="loader-inner">
    <svg class="loader-svg" viewBox="0 0 50 50" width="64" height="64" aria-hidden="true">
      <circle class="loader-ring" cx="25" cy="25" r="20" fill="none" stroke-width="4"></circle>
    </svg>
    <div class="loader-text">Processing...</div>
  </div>
</div>

<script src="script.js"></script>
</body>
</html>