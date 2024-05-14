// const PIN_MODES = ['output', 'analog', 'input', 'input_pullup', 'input_pulldown', 'opendrain', 'af_output', 'af_opendrain', 'auto'];
const INPUT_PIN_MODES = ['analog', 'input', 'input_pullup', 'input_pulldown', 'auto'];
/**
 * @class
 * Определяет основной функционал порта-сенсора и представляет каждый переданный порт в виде измерительного канала.
 * Не используется в прикладных целях.
 */
class ClassPortSensor extends ClassSensor {
    constructor(opts) {
        ClassSensor.call(this, opts);

        if (typeof opts.pinModes === 'object') {
            for (let i = 0; i < this._QuantityChannel;i++) 
                this.Configure(i, { mode: opts.pinModes[i] });
        }
    }
    Start(_chNum, _period, _opts) {
        let opts = _opts || {};
        let curr_mode = this._Pins[_chNum].getMode();
        if (! (INPUT_PIN_MODES.includes(curr_mode) || opts.force)) return false;
        this._ChStatus[_chNum] = 1;
        
        this._Interval = setInterval(() => {
            this._ChStatus.forEach((status, i) => {
                if (status === 1) this[`Ch${i}_Value`] = this.Read(this._Pins[i]);
            });
        }, _period);
    }
    Stop(_chNum) {
        if (typeof this._ChStatus[_chNum] !== 'number') return false;
        this._ChStatus[_chNum] = 0;
        
        if (!this._ChStatus.find(s => s !== 0)) {
            clearInterval(this._Interval);
        }
    }
    Read(port) {
        if (this._TypeInSignal == 'analog')
            return analogRead(port);
        return digitalRead(port);
    }
    /**
     * @typedef PinOpts
     * @property {string} mode
     */
    /**
     * Пример 
     * { mode: 'analog' }
     */
    /**
     * @method
     * @param {[PinOpts]} _opts 
     */
    Configure(_chNum, _opts) {
        if (!INPUT_PIN_MODES.includes(_opts.mode))
            return false;
        this._Pins[_chNum].mode(_opts.mode); 
        return true;
    }
    
    GetInfo(_chNum) {
        return Object.assign({ mode: this._Pins[_chNum].getMode() }, this._Pins[_chNum].getInfo());
    }
}

exports = ClassPortSensor; 