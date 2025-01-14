class SlotMachine {
    // initializews the game stats and stuff :3

    isDead = false

    songs = {
        boneDepot: new Audio('../audios/BoneDepot.mp3'),
        LegalWoes: new Audio('../audios/LegalWoes.mp3'),
        AppartementTheme: new Audio('../audios/AppartementTheme.mp3'),
        PawprintPanic: new Audio('../audios/PawprintPanic.mp3'),
        OkayEveryone: new Audio('../audios/OkayEveryone.mp3'),
        Downtown: new Audio('../audios/Downtown.mp3'),
        Sunshine: new Audio('../audios/Sunshine.mp3'),
        PlanarianPuzzle: new Audio('../audios/PlanarianPuzzle.mp3'),
        MiniGolf: new Audio('../audios/MiniGolf.mp3')
    }

    currentSong = this.songs.boneDepot

    loanAlert = new Audio('../audios/loanAlert.mp3')
    payLoanSuccess = new Audio('../audios/chaChing.mp3')
    reelSpin = new Audio('../audios/spin.mp3')
    mail = new Audio('../audios/yougotmail.mp3')
    adSound = new Audio('../audios/adSound.mp3')
    meow = new Audio('../audios/meow-1.mp3')
    heartbeat = new Audio('../audios/heartbeat.mp3')
    ouch = new Audio('../audios/ouch.mp3')
    
    // :3
    drunkLevel = 0

    images = [
            '../images/soggy.jpg',
            '../images/toinge.png',
            '../images/stretch.jpg',
            '../images/sproing.jpg',
            '../images/hair.jpg',
            '../images/herbert.jpg',
            '../images/lick.jpg',
            '../images/sideeye.jpg',
            '../images/bluetooth.jpg'
    ]

    // initializing
    dabloons = 100
    loan = 0
    timeLeft = 90
    isSpinning = false
    spinCost = 20
    loanInterest = 1.20

    // display ads every 30 seconds
    initializeAds() {
        this.closeAdButton = document.getElementById('closeAdButton')
        this.adStuff = document.getElementById('adStuff')
        this.adImage = document.getElementById('adImage')

        this.closeAdButton.addEventListener('click', () => {
            this.adStuff.classList.remove('show')
        })

        setInterval(() => this.showRandomAd(), 30000)
    }

    showRandomAd() {
        const adImages = [
            '../images/ad1.jpg',
            '../images/ad2.jpg',
            '../images/ad3.jpg',
            '../images/ad4.jpg',
            '../images/ad5.jpg',
            '../images/ad6.jpg',
            '../images/ad7.jpg',
            '../images/ad8.jpg',
            '../images/ad9.jpg',
            '../images/ad10.jpg',
            '../images/ad11.jpg',
            '../images/ad12.jpg',
            '../images/ad13.jpg',
            '../images/ad14.jpg',
            '../images/ad15.jpg',
            '../images/ad16.jpg',
            '../images/ad17.jpg',
            '../images/ad18.jpg',
            '../images/ad19.jpg',
            '../images/ad20.jpg',
            '../images/ad21.jpg'
        ]

        if (this.isDead) {
            return
        }

        // picks random ad
        this.adImage.src = adImages[Math.floor(Math.random() * adImages.length)]
        this.adStuff.classList.add('show')
        this.mail.play()
        this.adSound.play()

        // 2 second wait before being able toc lose ads
        this.closeAdButton.disabled = true
        setTimeout(() => {
            this.closeAdButton.disabled = false
        }, 2000)
    }

    startGame() {
        this.initializeElements()
        this.setupEventListeners()
        this.startTimer()
        this.initializeAds()

        this.currentSong.loop = true
        this.currentSong.play()

        this.reels.forEach(reel => {
            const img = reel.querySelector('img');
            img.src = this.images[Math.floor(Math.random() * this.images.length)];
        })
    }

    initializeElements() {

        // music selection
        this.musicSelect = document.getElementById('musicSelect')

        // grabbing reel ids
        this.reels = [
            document.getElementById('reel1'),
            document.getElementById('reel2'),
            document.getElementById('reel3'),
            document.getElementById('reel4')
        ]

        // getting sooo many buttons all of them
        this.spinButton = document.getElementById('spinButton');
        this.loanButton  = document.getElementById('loanButton');
        this.winMessage = document.getElementById('winMessage');
        this.slotMachine = document.getElementById('slotMachine');
        this.dabloonsCounter = document.getElementById('dabloonCounter');
        this.loanCounter = document.getElementById('loanCounter');
        this.timeCounter = document.getElementById('timeCounter');

        // getting aaalllll the pop ups
        this.loanStuff = document.getElementById('loanStuff')
        this.paymentStuff = document.getElementById('paymentStuff')
        this.deathStuff = document.getElementById('deathStuff')
        this.loanAmountInput = document.getElementById('loanAmountInput')
        this.confirmLoanButton = document.getElementById('confirmLoanButton')
        this.cancelLoanButton = document.getElementById('cancelLoanButton');
        this.payLoanButton = document.getElementById('payLoanButton');
        this.restartButton = document.getElementById('homeScreenButton');
        this.loanAmountSpan = document.getElementById('loanAmount');
    }

    setupEventListeners() {
        this.spinButton.addEventListener('click', () => this.spin());
        this.loanButton.addEventListener('click', () => this.showLoanStuff());
        this.confirmLoanButton.addEventListener('click', () => this.takeLoan());
        this.cancelLoanButton.addEventListener('click', () => this.loanStuff.classList.remove('show'));
        this.payLoanButton.addEventListener('click', () => this.payLoan());
        this.restartButton.addEventListener('click', () => window.location.href = '../Mainpage.html');
        this.musicSelect.addEventListener('change', () => {
            this.currentSong.pause()
            this.currentSong.currentTime = 0

            if (this.musicSelect.value === 'mute') {
                return // so that it doesnt start a new one if mute selected
            }

            this.currentSong = this.songs[this.musicSelect.value]
            this.currentSong.loop = true
            this.currentSong.play()
        })
        
        document.getElementById('shopButton').addEventListener('click', () => {
            document.getElementById('shopStuff').classList.add('show')
        })

        document.getElementById('closeShopButton').addEventListener('click', () => {
            document.getElementById('shopStuff').classList.remove('show')
            document.getElementById('bottleCount').textContent = '0'
        })

        // alcohol quantity
        let quantity = 0
        document.getElementById('plusBottle').addEventListener('click', () => {
            const maxBottles = Math.floor(this.dabloons / 50)
            if (quantity < maxBottles) {
                quantity++
                document.getElementById('bottleCount').textContent = quantity
            }
        })

        document.getElementById('minusBottle').addEventListener('click', () => {
            if (quantity > 0) {
                quantity--
                document.getElementById('bottleCount').textContent = quantity
            }
        })

        // BUY DRINK BUY BUY BUY
        document.getElementById('buyAlcohol').addEventListener('click', () => {
            const cost = quantity * 50
            if (quantity > 0 && this.dabloons >= cost) {
                this.dabloons -= cost
                this.drunkLevel += quantity
                this.applyDrunkEffect()
                this.updateDisplays()
                this.meow.play()
                document.getElementById('shopStuff').classList.remove('show')
                quantity = 0
                document.getElementById('bottleCount').textContent = 0
            }
        })
    }

    // GETT DRUNK MAKE SCREEN WOBBLE WOBBLE
    applyDrunkEffect() {
        let style = document.getElementById('drunk-style')
        if (!style) {
            style = document.createElement('style')
            style.id = 'drunk-style'
            document.head.appendChild(style)
        }

        const intensity = Math.min(this.drunkLevel * 0.5, 12) // screen intensity
        const intensity2 = Math.min(this.drunkLevel * 0.5, 5) // music intensity

        style.textContent = `

            html, body {
                overflow: hidden;
            }
            
            body {
                animation: distort ${3/intensity}s infinite ease-in-out;
            }
            
            @keyframes distort {
                0% { 
                    transform: scale(1) rotate(0deg);
                    filter: blur(0px);
                }
                25% { 
                    transform: scale(${1 + intensity/30}) rotate(${intensity/2}deg);
                    filter: blur(${intensity}px);
                }
                50% { 
                    transform: scale(${1 - intensity/40}) rotate(-${intensity/2}deg);
                    filter: blur(${intensity/2}px);
                }
                75% { 
                    transform: scale(${1 + intensity/30}) rotate(${intensity/2}deg);
                    filter: blur(${intensity}px);
                }
                100% { 
                    transform: scale(1) rotate(0deg);
                    filter: blur(0px);
                }
            }
            
            .reel img {
                filter: blur(${intensity}px) brightness(${1 + intensity/20});
                transform: scale(${1 + intensity/50});
            }`

        
        // distort audios when drunk
        this.currentSong.playbackRate = 1 - (intensity2 * 0.1)
        this.currentSong.preservesPitch = false

        this.musicSelect.disabled = true

        this.heartbeat.volume = intensity2 * 0.2
        this.heartbeat.loop = true
        this.heartbeat.play()

        this.mail.playbackRate = 1 - (intensity2 * 0.1)
        this.mail.preservesPitch = false

        this.reelSpin.playbackRate = 1 - (intensity2 * 0.1)
        this.reelSpin.preservesPitch = false

        this.loanAlert.playbackRate = 1 - (intensity2 * 0.1)
        this.loanAlert.preservesPitch = false

        this.meow.playbackRate = 1 - (intensity2 * 0.1)
        this.meow.preservesPitch = false

        setTimeout(() => {
            if (this.drunkLevel > 0) {
                this.drunkLevel--
                this.applyDrunkEffect()
            }

            // fix all audios when drunk level is gone
            if (this.drunkLevel === 0) {
                style.remove()
                this.currentSong.playbackRate = 1
                this.currentSong.preservesPitch = true

                this.heartbeat.pause()
                this.heartbeat.currentTime = 0
                
                this.mail.playbackRate = 1
                this.mail.preservesPitch = true

                this.reelSpin.playbackRate = 1
                this.reelSpin.preservesPitch = true

                this.loanAlert.playbackRate = 1
                this.loanAlert.preservesPitch = true

                this.meow.playbackRate = 1
                this.meow.preservesPitch = true

                this.musicSelect.disabled = false
            }
        }, 30000)
    }

    showLoanStuff() {
        this.loanStuff.classList.add('show')
    }

    takeLoan() {

        let amount = parseInt(this.loanAmountInput.value)
        if (!isNaN(amount) && amount >= 100) { // minimum loan amount
            this.dabloons += amount; // get moneys
            this.loan += Math.floor(amount * this.loanInterest); // interest
            this.timeLeft = 90; // reset time
            this.updateDisplays();
            this.loanStuff.classList.remove('show');
            this.meow.play()
            this.ouch.play()
    
            // Restart the timer
            clearInterval(this.timer); // Clear any existing timer
            this.startTimer(); // Start a new timer
        }
    }
    
    
    startTimer() {
        this.timer = setInterval(() => {
            if (this.loan > 0) { // count down only if active loan
                this.timeLeft--
                if (this.timeLeft <= 0) {
                    this.showPaymentStuff() // PAY IT NOW!!!! prompts payment
                }
            }
            this.updateDisplays()
        }, 1000) // update per second
    }

    // show payment due pop up
    showPaymentStuff() {
        clearInterval(this.timer)
        this.loanAlert.play()
        this.loanAmountSpan.textContent = this.loan
        this.paymentStuff.classList.add('show')

        // add flash animation to make reddd
        const paymentPopup = this.paymentStuff.querySelector('.loan-content')
        paymentPopup.classList.add('loan-flash')

        // remove flash animation
        setTimeout(() => {
            paymentPopup.classList.remove('loan-flash')
        }, 1500)

        paymentPopup.classList.add('show')
    }

    // try to pay back loan
    payLoan() {
        if (this.dabloons >= this.loan) {
            this.dabloons -= this.loan // pay loan
            this.loan = 0 // clear loan
            this.timeLeft = 90
            this.paymentStuff.classList.remove('show')
            this.updateDisplays()
            this.startTimer()
            this.loanAlert.pause()
            this.loanAlert.currentTime = 0
            this.payLoanSuccess.play()
        } 
        else {
            this.die() // no money = game over
        }
    }

    // stops all audios for when you enact die() function
    stopAllAudio() {
        // array of all audio objects to stop
        const audios = [
            this.loanAlert,
            this.reelSpin,
            this.currentSong
        ];
        
        audios.forEach(audio => {
            if (audio && !audio.paused) { // check if the audio is valid and playing
                audio.pause(); // pause the audio
                audio.currentTime = 0; // reset to the beginning
            }
        });
    }

    // if they die
    die() {

        this.isDead = true

        this.stopAllAudio()

        document.documentElement.classList.add('dying')
        document.getElementById('alien').style.display = 'none'

        // stop any possible drunk effects
        this.drunkLevel = 0
        const drunkStyle = document.getElementById('drunk-style')
        if (drunkStyle) {
        drunkStyle.remove()
        }

        this.heartbeat.pause()
        this.heartbeat.currentTime = 0
        this.currentSong.playbackRate = 1
        this.currentSong.preservesPitch = true
        this.mail.playbackRate = 1
        this.mail.preservesPitch = true
        this.reelSpin.playbackRate = 1
        this.reelSpin.preservesPitch = true
        this.loanAlert.playbackRate = 1
        this.loanAlert.preservesPitch = true

        // show death screen :3
        this.paymentStuff.classList.remove('show')
        this.deathStuff.classList.add('show');
        clearInterval(this.timer)

        this.musicSelect.disabled = true
        let sayonara = new Audio('../audios/sayonara.mp3')
        let die = new Audio('../audios/die.mp3')
        let bigheartbeat = new Audio('../audios/bigheartbeat.mp3')
        sayonara.play()
        die.play()
        bigheartbeat.loop()
        bigheartbeat.play()

    }
    
    // updates all numbers on screen
    updateDisplays() {
        this.dabloonsCounter.textContent = this.dabloons
        this.loanCounter.textContent = this.loan

        // if loan is active, it'll display the blue counter
        if (this.loan > 0) {
            this.timeCounter.textContent = this.timeLeft + "s"
            this.timeCounter.style.color = "#4dc3ff"
            this.loanButton.textContent = "Loan Already Active"
        }
        
        // if not it'll be greyed out and say no active loans
        else {
            this.timeCounter.textContent = "No Active Loans"
            this.timeCounter.style.color = "#666666"
            this.loanButton.textContent = "Take Out Loan"
        }

        // if player cant afford anything then it's disabled
        this.spinButton.disabled = this.dabloons < this.spinCost

        // if player already has an active loan, then disable loan button
        this.loanButton.disabled = this.loan > 0
    }

    // main spin function that handles one whole machine spin (I HATE CLASSES AND OBJECTS SO MUCH AHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH)
    spin() {
        // dont let people spin if theyre spinning or cant afford it
        if (this.isSpinning || this.dabloons < this.spinCost) return

        // take cost from person's moneys
        this.dabloons -= this.spinCost
        this.updateDisplays()

        // start spin
        this.isSpinning = true
        this.spinButton.disabled = true
        this.winMessage.textContent = ''
        this.winMessage.classList.remove('show')
        this.slotMachine.classList.remove('winning-flash')

        // spin each reel thingy and reflect back the results
        let results = []
        
        // spin each reel in sequence (delaying each spin) with the most annoying eye grating callbacks that are nested 50000 times
        
        // reel 1 w/ no delay
        this.spinReel(this.reels[0], 0, (result) => {
            results.push(result)
            
            // reel 2 w 400ms delay
            this.spinReel(this.reels[1], 400, (result) => {
                results.push(result)

                // reel 3 w 400ms delay
                this.spinReel(this.reels[2], 400, (result => {
                    results.push(result)

                    // reel 4 w 400ms delay
                    this.spinReel(this.reels[3], 400, (result) => {
                        results.push(result)

                        // once reels stopped check if person won
                        setTimeout(() => {
                            this.checkWin(results)
                            this.isSpinning = false

                            // only enable spins again IF player can afford it again
                            this.spinButton.disabled = this.dabloons < this.spinCost
                        }, 500) // wait 500ms after last reeel stops before checking the win
                    })
                }))
            })
        })
    }

    spinSounds() {
        this.spin = new Audio('../audios/spin.mp3')
        this.spin.play()
    }

    // check for winning combinations
    checkWin(results) {

        // count how many of each symbol we got
        let counts = {}
        results.forEach(index => {
            counts[index] = (counts[index] || 0) + 1
        })

        let pairCount = Object.values(counts).filter(count => count === 2).length

        // find highest number of matching symbols
        let maxMatches = Math.max(...Object.values(counts))

        let winAmount = 0
        let message = ''

        // set winning amounts and messages based on matches
        if (maxMatches === 4) {
            winAmount = 2000 // 4 of a kind, big jackpot
            message = '🐈🎉 JACKPOT! FOUR OF A KIND! 🎉🐈'
            this.slotMachine.classList.add('winning-flash')
            this.megaJackpot()
            
        }

        else if (maxMatches === 3) {
            winAmount = 500 // 3 of a kind, medium win
            message = '🐈🎺 Three of a kind! 🎺🐈'
            this.slotMachine.classList.add('winning-flash')
            this.mediumjackpot()
        }

        else if (maxMatches === 2 && pairCount === 2) {
            winAmount = 50 // two pairs :3
            message = '😸 Two pairs! Double win! 😸'
            this.victorySounds()
        }

        else if (maxMatches === 2) {
            winAmount = 15 // two of a kind, small tiny tiny win
            message = '😸 Two of a kind! 😸'
            this.victorySounds()
        }

        // if we won anything, update dabloons and show message
        if (winAmount > 0) {
            this.dabloons += winAmount
            this.updateDisplays()
            this.showWinMessage(message, winAmount)
            
        }
    }

        mediumjackpot() {
            this.victorySound1 = new Audio('../audios/victorySound1.mp3')
            this.jackpot = new Audio('../audios/jackpot.mp3')
            this.chaChing = new Audio('../audios/chaChing.mp3')
            this.chaChing.play()
            this.victorySound1.play()
            this.jackpot.play()
        }

        megaJackpot() {
            this.victorySound1 = new Audio('../audios/victorySound1.mp3')
            this.jackpot = new Audio('../audios/jackpot.mp3')
            this.youwin = new Audio('../audios/youwin.mp3')
            this.chaChing = new Audio('../audios/chaChing.mp3')
            this.chaChing.play()
            this.victorySound1.play()
            this.jackpot.play()
            this.youwin.play()
        }

        victorySounds() {
            this.chaChing = new Audio('../audios/chaChing.mp3')
            this.chaChing.play()
        }

    // display winning message
    showWinMessage(message, amount) {
        this.winMessage.innerHTML = `${message}<br><span class="dabloons-won">+${amount} dabloons!</span>`
        this.winMessage.classList.add('show')
    }

    // animates reel spin and returns symbols
    spinReel(reel, delay, callback) {
        setTimeout(() => {
            this.reelSpin.currentTime = 0
            this.reelSpin.play(); // Play reel spin sound

            // picks a random symbol from images array
            let randomIndex = Math.floor(Math.random() * this.images.length)
            let img = reel.querySelector('img')

            img.style.top = '-200px'
            setTimeout(() => {
                img.style.transition = 'none'
                img.style.top = '200px'
                img.src = this.images[randomIndex]
                
                // i said animatiosn were cool in html file but JK THESE ARE SO ANNOYING I RESEACHED THIS SUTPID STUFF ALL DAY
                requestAnimationFrame(() => {
                    img.style.transition = 'top 0.5s ease-in-out'
                    img.style.top = '0px'
                })
            }, 50)
            
            callback(randomIndex)
        }, delay)
    }

}

document.addEventListener('DOMContentLoaded', () => {
    const slotMachine = new SlotMachine()
    slotMachine.startGame();
});