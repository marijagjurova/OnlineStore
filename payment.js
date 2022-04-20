

new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      console.log('LCP candidate:', entry.startTime, entry);
    }
  }).observe({type: 'largest-contentful-paint', buffered: true});

(function( $ ){
    
    var PLUGIN_NS = 'paymentForm';

    var Plugin = function ( target, options )  { 
        this.$T = $(target); 
        this._init( target, options ); 

       this.options= $.extend(
            true,               
            {
                DEBUG: false
            },
            options
        );
        
        this._cardIcons = {
            "visa"          : "fa fa-cc-visa",
            "mastercard"    : "fa fa-cc-mastercard",
            "amex"          : "fa fa-cc-amex",
            "dinersclub"    : "fa fa-cc-diners-club",
            "discover"      : "fa fa-cc-discover",
            "jcb"           : "fa fa-cc-jcb",
            "default"       : "fa fa-credit-card-alt"
        };
        
        return this; 
    }

    Plugin.prototype._init = function ( target, options ) { 
        var base = this;
        
        base.number = this.$T.find("[data-payment='cc-number']");
        base.exp = this.$T.find("[data-payment='cc-exp']");
        base.cvc = this.$T.find("[data-payment='cc-cvc']");
        base.brand = this.$T.find("[data-payment='cc-brand']");
        
        

        base.number.payment('formatCardNumber').data('payment-error-message', 'Please enter a valid credit card number.');
        base.exp.payment('formatCardExpiry').data('payment-error-message', 'Please enter a valid expiration date.');
        base.cvc.payment('formatCardCVC').data('payment-error-message', 'Please enter a valid CVV.');
        
        

        base.number.on('input', function() {
            base.cardType = $.payment.cardType(base.number.val());
            var fg = base.number.closest('.form-group');
            fg.toggleClass('has-feedback', true);
            fg.find('.form-control-feedback').remove();            
            if (base.cardType) {
                base.brand.text(base.cardType);
            
                var icon = base._cardIcons[base.cardType] ? base._cardIcons[base.cardType] : base._cardIcons["default"];
                fg.append("<i class='" + icon + " fa-lg payment-form-icon form-control-feedback'></i>");
            } else {
                $("[data-payment='cc-brand']").text("");
            }
        });
        
        
        base.number.on('change', function () {
            base._setValidationState($(this), !$.payment.validateCardNumber($(this).val()));
        });

        
        base.exp.on('change', function () {
            base._setValidationState($(this), !$.payment.validateCardExpiry($(this).payment('cardExpiryVal')));
        });
        
        
        base.cvc.on('change', function () {
            base._setValidationState($(this), !$.payment.validateCardCVC($(this).val(), base.cardType));
        });   
    };


    Plugin.prototype.valid = function () {
        var base = this;
        
        var num_valid = $.payment.validateCardNumber(base.number.val());
        var exp_valid = $.payment.validateCardExpiry(base.exp.payment('cardExpiryVal'));
        var cvc_valid = $.payment.validateCardCVC(base.cvc.val(), base.cardType);
        
        base._setValidationState(base.number, !num_valid);
        base._setValidationState(base.exp, !exp_valid);
        base._setValidationState(base.cvc, !cvc_valid);
        
        return num_valid && exp_valid && cvc_valid;
    }
 
    /*PRIVATE METHODS*/
    Plugin.prototype._setValidationState = function(el, erred) {
        var fg = el.closest('.form-group');
        fg.toggleClass('has-error', erred).toggleClass('has-success', !erred);
        fg.find('.payment-error-message').remove();
        if (erred) {
            fg.append("<span class='text-danger payment-error-message'>" + el.data('payment-error-message') + "</span>");
        }
        return this;
    }  
       
    Plugin.prototype.DLOG = function () 
    {
        if (!this.DEBUG) return;
        for (var i in arguments) {
            console.log( PLUGIN_NS + ': ', arguments[i] );    
        }
    }
    Plugin.prototype.DWARN = function () 
    {
        this.DEBUG && console.warn( arguments );    
    }
    
    $.fn[ PLUGIN_NS ] = function( methodOrOptions ) {
        if (!$(this).length) {
            return $(this);
        }
        var instance = $(this).data(PLUGIN_NS);
            
        // public method on PLUGIN class        
        if ( instance 
                && methodOrOptions.indexOf('_') != 0 
                && instance[ methodOrOptions ] 
                && typeof( instance[ methodOrOptions ] ) == 'function' ) {
            
            return instance[ methodOrOptions ]( Array.prototype.slice.call( arguments, 1 ) ); 
                
                
                
        } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {

            instance = new Plugin( $(this), methodOrOptions );  
            $(this).data( PLUGIN_NS, instance );
            return $(this);
        
        // CASE: method called before init
        } else if ( !instance ) {
            $.error( 'Plugin must be initialised before using method: ' + methodOrOptions );
        
        // CASE: invalid method
        } else if ( methodOrOptions.indexOf('_') == 0 ) {
            $.error( 'Method ' +  methodOrOptions + ' is private!' );
        } else {
            $.error( 'Method ' +  methodOrOptions + ' does not exist.' );
        }
    };
})(jQuery);

/* Initialize validation */
var payment_form = $('#payment-stripe').paymentForm();

$('#validate').on('click', function(){
  var valid = $('#payment-stripe').paymentForm('valid');
  if (valid)
    alert('CC information is good!');
  else
    alert('PLEASE enter CC information');
});
