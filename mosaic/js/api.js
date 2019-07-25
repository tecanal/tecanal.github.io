var table = document.getElementById("mosaic");

/**
 * The class that allows for color interaction.
 */
class Color {
    /**
    * Generates a random color.
    */
    static random() {
        let letters = "0123456789ABCDEF";
        let color = "#";

        for (var i = 0; i < 6; i++) 
            color += letters[Math.floor(Math.random() * 16)];
                
        return color;
    };

    /**
     * Invert the color.
     */
   static invert(color) {
        // Strip rgb() text
        color = color.replace("rgb(", "").replace(")", "");

        // Split into array and convert to integers
        let colorValues = color.split(", ").map(function(x) { 
            return parseInt(x, 10);
        });

        // Invert red, green, and blue color values
        colorValues[0] = 255 - colorValues[0];
        colorValues[1] = 255 - colorValues[1];
        colorValues[2] = 255 - colorValues[2];

        // Return the new color in rgb() format
        return "rgb(" + colorValues.join(", ") + ")";
    };
}

/**
 * The Mosaic class.
 */
class Mosaic {
    constructor(height, width) {
        // Set the height and width
        this._height = height;
        this._width = width;

        // Clear any leftover table HTML
        table.innerHTML = "";

        // Create table with height and width parameters
        for (var i = 0; i < height; i++) {
            var row = table.insertRow(i);

            for (var j = 0; j < width; j++) 
                row.insertCell(j);
        }
    };
                
    /**
     * Set the height of the Mosaic object.
     */
    set height(height) {
        this._height = height;
    }

    /**
     * Get the width of the Mosaic object.
     */
    set width(width) {
        this._width = width;
    }
                
    /**
     * Get the height of the Mosaic object.
     */
    get height() {
        return this._height;
    }

    /**
     * Get the width of the Picture object.
     */
    get width() {
        return this._width;
    }
                
    /**
     * Set the tile color at x, y.
     */
    setTileColor(x, y, color) {
        table.rows[this._height - 1 - y].children[x].style.backgroundColor = color;
    };

    /**
     * Get the tile color at x, y.
     */
    getTileColor(x, y) {
        return table.rows[this._height - 1 - y].children[x].style.backgroundColor;
    };
                
    /**
     * Set the tile click function.
     */
    setTileOnClick(x, y, func) {
        table.rows[this._height - 1 - y].children[x].addEventListener("click", func)
    }

    /**
     * A wrapper function to allow animation looping.
     */
    static loop(func, time) {
        setInterval(func, time);
    }

    /**
     * Clear the Mosaic's tile color values.
     */
    clear() {
        for (var i = 0; i < this._width; i++) 
            for (var j = 0; j < this._height; j++) 
                this.setTileColor(i, j, '#eeeeee');
    };
}