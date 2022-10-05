class verySimpleSlider {
    constructor(
        slider,
        options = {}
    )
    {
        this.initialization(slider, options);
    }

    initialization(slider, options) {
        this.slider = document.querySelector(slider);
        if (this.slider === null) {
            return;
        }
        this.isActiveSlider = false;
        this.selector = slider;
        this.sliderChildren = document.querySelector(slider).children;
        this.sliderItems = [...this.sliderChildren];
        this.options = options;
        this.sliderWidth  =  null;
        this.sliderHeight = null;
        this.sliderItemWidth = null;
        this.sliderTrack = null;
        this.sliderTrackPos = 0;
        this.sliderTrackStep = null;
        this.initialItems = this.options.items;
        this.counter = 0;
        this.numOfItems = this.sliderItems.length;
        this.start();
    }

    start() {
        this.resize();
        this.IsActive();
        this.responsive();

        this.addSliderTrack();
        this.defaultValues();
        this.defaultStyles();
        this.setSliderWidthAndHeight();
        this.calcSliderTrackStep();


        this.clickOnRightBtn();
        this.clickOnLeftBtn();
        this.autoScroll();
    }

    resize() {

        window.addEventListener('resize', () => {
            this.IsActive();
            this.responsive();

            this.setSliderWidthAndHeight();
        
            this.calcSliderTrackStep();
           
            // resetSlider
            this.sliderTrackPos = 0;
            this.counter = 0;
            this.sliderTrackAnim(this.sliderTrackPos);
        });
    }

    IsActive() {

        let {activateSliderWhen} = this.options;

        let screenWidth = document.documentElement.clientWidth;

        if (
                screenWidth <= activateSliderWhen || 
                activateSliderWhen === undefined ||
                typeof activateSliderWhen !== 'number'
            ) 
            {
                if(!this.isActiveSlider) {
                    this.isActiveSlider = true;
                    this.addSliderTrack();
                }else {
                    return;
                }
            }else if(screenWidth > activateSliderWhen) {
                if(this.isActiveSlider) {
                    this.isActiveSlider = false;
                    this.removeSliderTrack();
                }else {
                    return;
                }
            }
    }

    addSliderTrack() {
        if(this.sliderTrack === null) {
            const htmlSliderTrack = document.createElement('div');
            this.slider.append(htmlSliderTrack);
            this.sliderItems.forEach(item => {
                htmlSliderTrack.append(item);
            }); 
            this.sliderTrack = htmlSliderTrack;
            this.removeSliderTrack();
        }else {
            this.slider.append(this.sliderTrack);
            this.sliderItems.forEach(item => {
                this.sliderTrack.append(item);
            });
            this.setSliderWidthAndHeight();
            this.slider.style.background = 'transparent';    
            this.slider.style.position = 'relative';
            this.slider.style.overflow = 'hidden';
        }
        
    }
    removeSliderTrack() {
        this.sliderTrack.remove();
        this.sliderItems.forEach(item => {
            this.slider.append(item);
        });
        this.slider.style = ''; 
    }

    defaultValues() {

        let defaultValues = {
            items: 1,
            itemsGap: 20,
            btnLeft: false,
            btnRight: false,
            animTime: 500,
            autoScroll: false,
            autoScrollTime: 3000,
            stepItemsAll: false,
            stopAutoScrollWhenMouseOnElement: this.selector,
            // activateSliderWhen: false 
        };

        for(let key in defaultValues) {
            if(this.options[key] === undefined) {
                this.options[key] = defaultValues[key];
            }  
        }
    //  console.log(this.options);
    }

    defaultStyles() {

        let {itemsGap, animTime} = this.options;
        let centerEl = 
        (this.sliderWidth - 
        (this.sliderWidth - itemsGap)) / 2;
        

        function calcTrtransition() {
            let styleTransition;
            let RoundingAnimTime = 
                Math.round(animTime / 100) * 100;
    
            if(animTime <= 999) {
                styleTransition = 
                    `.${RoundingAnimTime / 100}s`;

            }else if (animTime > 999) {
                styleTransition = 
                    `${Math.floor(RoundingAnimTime / 999)}s`;
            }
            return  styleTransition;
        }

        if (this.isActiveSlider) {
            this.setSliderWidthAndHeight();
            this.slider.style.background = 'transparent';    
            this.slider.style.position = 'relative';
            this.slider.style.overflow = 'hidden';
        }
        this.sliderTrack.style.display = 'flex';
        this.sliderTrack.style.left = `${centerEl}px`;
        this.sliderTrack.style.position = 'absolute';
        this.sliderTrack.style.transition = calcTrtransition();
        this.sliderTrack.style.columnGap = `${itemsGap}px`;
    }

    setSliderWidthAndHeight() {
        let {items, itemsGap} = this.options;

        this.sliderWidth = 
            this.sliderItems[0].offsetWidth * 
            items +
            itemsGap * items;

        this.sliderHeight = this.sliderItems[0].offsetHeight;

        this.sliderItemWidth = 
            this.sliderItems[0].offsetWidth + itemsGap;


        if (!this.isActiveSlider) {
            this.slider.style.width = '';
            this.slider.style.height = '';
            return;
        }
        
        this.slider.style.width = `${this.sliderWidth}px`;
        this.slider.style.height = `${this.sliderHeight}px`;
        
    }

    oddParityAdjustment(direction) {

        let {items, stepItemsAll} = this.options;

        let preCounter = this.stepItemsAllChecker() - 1;
        
        let isInteger = (this.numOfItems) / items;
        let remainderOfItems = 
            items - (this.numOfItems % items);

        // console.log(isInteger % 2);
        if (
                !stepItemsAll || 
                items === this.numOfItems || 
                isInteger % 2 === 0 ||
                isInteger % 2 === 1
            ) 
        {
            return;
        }
        

        if (preCounter === 0 && direction === 'right') {
            this.sliderTrackPos += 
                this.sliderItemWidth * remainderOfItems;
            return;
        }else if (preCounter === 0 && direction === 'left') {
            
            if (this.counter === 0) {
                this.sliderTrackPos = 0;
                this.sliderTrackStep = 0;
                return;
            }

            this.sliderTrackPos = 
                -(this.sliderTrackStep) * 
                (this.stepItemsAllChecker() + 1);

            this.sliderTrackPos += 
                this.sliderItemWidth * remainderOfItems;
            return;
        }


        if(direction === 'right') {
            if (isInteger % 2 !== 0 && stepItemsAll) {

                if (this.counter === preCounter) {
                    this.sliderTrackPos += 
                        this.sliderItemWidth * remainderOfItems;
                }
            
            }
        }else if (direction === 'left') {
            if (isInteger % 2 !== 0 && stepItemsAll) {
                if (
                        this.counter === preCounter - 1
                    ) 
                {
                    this.sliderTrackPos -= 
                    (this.sliderItemWidth * remainderOfItems);

                }else if (this.counter === -1) {
                    this.sliderTrackPos += 
                    (this.sliderItemWidth * remainderOfItems);
                }
            }
        }
    } 

    calcSliderTrackStep() {
        let {items, stepItemsAll} = this.options;

        if (stepItemsAll && items > 1) {
            this.sliderTrackStep = this.sliderWidth;
            return;
        }

        if (items > 1) {
            this.sliderTrackStep = 
                (this.sliderWidth - this.sliderItemWidth) / (items - 1);
        }else {
            this.sliderTrackStep = this.sliderItemWidth;
        }

    }

    clickOnRightBtn() {
        let {items, btnRight} = this.options;
        if(btnRight) {
            const btn = document.querySelector(btnRight);
            btn.addEventListener('click', ()=> {
                this.moveRight(this.counter++);
            });
        }
    }

    clickOnLeftBtn() {
        let {btnLeft} = this.options;
        if (btnLeft) {
            const btn = document.querySelector(btnLeft);
            btn.addEventListener('click', ()=> {
                this.moveLeft(this.counter--);
            });
        }
    }

    sliderTrackAnim(trackPos) {
        this.calcSliderTrackStep();
        this.sliderTrack.style.transform = `translate(${trackPos}px)`;
    }

    // Для условия в moveRight и moveLeft
    stepItemsAllChecker() {
        let {items, stepItemsAll} = this.options;

        if (stepItemsAll && items > 1) {
            return Math.ceil(this.numOfItems / items - 1);
        }
        return this.numOfItems - items;
    }

    moveRight() {
        this.oddParityAdjustment('right');
        if(this.counter > this.stepItemsAllChecker()) {
            this.sliderTrackPos = 0;
            this.counter = 0;
            this.sliderTrackAnim(this.sliderTrackPos);
        }else {
            this.sliderTrackPos -= this.sliderTrackStep;
            this.sliderTrackAnim(this.sliderTrackPos);
        }
        // this.oddParityAdjustment('right');
    }

    moveLeft() {
        let {items, stepItemsAll} = this.options;
        if(this.counter === -1) {
            this.sliderTrackPos = 
                -(this.sliderTrackStep) * 
                (this.stepItemsAllChecker() + 1);
            this.oddParityAdjustment('left');

            if(stepItemsAll && items > 1) {
                this.counter = this.stepItemsAllChecker();
            }else {
                this.counter = this.numOfItems - items;
            }
        }
        this.oddParityAdjustment('left');
        this.sliderTrackPos += this.sliderTrackStep;
        this.sliderTrackAnim(this.sliderTrackPos);
    }

    autoScroll() {

        let {
            btnLeft,
            btnRight,
            autoScrollTime,
            stopAutoScrollWhenMouseOnElement,
        } = this.options;

        if(btnRight === false && btnLeft === false) {
            this.options.autoScroll = true;
        }

        let {autoScroll} = this.options;
        
        const onThatEl = 
            document.querySelector(stopAutoScrollWhenMouseOnElement);

        if(autoScroll) {
            let autoWipe = setInterval(()=> {
                this.moveRight(this.counter++);
            },  autoScrollTime);

            if(stopAutoScrollWhenMouseOnElement) {
                onThatEl.addEventListener('mouseenter', ()=> {
                    clearInterval(autoWipe);
                });
    
                onThatEl.addEventListener('mouseleave', ()=> {
                    clearInterval(autoWipe);
                        autoWipe = setInterval(()=> {
                            this.moveRight(this.counter++);
                    }, autoScrollTime);
                });
            }
            
        }
    }

    responsive() {
        let screenWidth = document.documentElement.clientWidth;

        const {responsive} = this.options;

        if (this.initialItems === undefined) {
            this.initialItems = 1;
        }

        for(let key in responsive) {
            if (screenWidth <= key) {
                this.options.items = responsive[key].items;
                return;
            }else if (screenWidth > key) {
                this.options.items = this.initialItems;
            }
        }   
    }
}




const slider = new verySimpleSlider(
    '#slider',
    {
        // activateSliderWhen: 1400,    
        items: 4,
        itemsGap: 15,
        btnRight: '.btn .right',
        btnLeft: '.btn .left',
        stepItemsAll: true,
        responsive: {
            1000: {
                items: 1
            },

            1200: {
                items: 2
            }
            
        }
    }
);