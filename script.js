// Custom Tetris, yo
// where you can have custom peices
// nd edit them nd stuff
// or generate a set of them based on number of tiles
// ye

// heres some interface configuration variables!
var tile_size = 24; // how many pixels wide and high a tile should be
var grid_thickness = 1; // how many pixels thick the grid should be
var grid_color = "#444";
var grid_selected_color = "#CCC";
var grid_pivot_color = "#5F5";
var background_color = "#999";

// get a random thing from an array yo
function random_choice(array)
{
	return array[Math.floor(Math.random() * array.length)];
}

// random booloan yeah sure whateverrrrrrrr
function random_boolean()
{
	return Math.random() < 0.5;
}

// some preset random colors to pick for random tiles
// for consistency
random_colors = ["#FF0000", "#FFFF00", "#00FF00", "#00FFFF", "#0000FF", "#FF00FF"];

// get one of the pretty colors
function get_random_color()
{
	return random_choice(random_colors);
}

// constructor for a tetris piece
function Piece(width, height, color)
{
	this.width = width;
	this.height = height;
	this.color = color;

	this.map = []; // a bitmap of bools or the like
	for(var i = 0; i < width * height; i++)
	{
		this.map.push(false);
	}

	// pivot point for rotation
	center_pivot(this);
}

// set a new center pivot
function center_pivot(piece)
{
	piece.pivot_x = Math.floor(piece.width / 2);
	piece.pivot_y = Math.floor(piece.height / 2);
}

// are these the coordinates of the pivot point?
function is_pivot(piece, x, y)
{
	return piece.pivot_x == x && piece.pivot_y == y;
}

// get a "pixel" of the piece by coordinates
function get_pixel(piece, x, y)
{
	var index = x + y * piece.width;
	pixel = piece.map[index];
	if(pixel == undefined)
	{
		return false;
	}
	else
	{
		return pixel;
	}
}

// and set one too!
function set_pixel(piece, x, y, value)
{
	var index = x + y * piece.width;
	piece.map[index] = value;
	deundefine(piece);
}

// get rid of undefineds, make them false's
function deundefine(piece)
{
	// and then get rid of any undefines
	for(var i = 0; i < piece.map.length; i++)
	{
		if(piece.map[i] == undefined)
		{
			piece.map[i] = false;
		}
	}
}

// create a totally randomized tetris piece
// based on width and height
function generate_random_piece_with_size(width, height)
{
	var piece = new Piece(width, height, get_random_color());
	for(var y = 0; y < height; y++)
	{
		for(var x = 0; x < width; x++)
		{
			set_pixel(piece, x, y, random_boolean());
		}
	}
	clean_piece(piece);
	return piece;
}

// is number in these bonuds?
function in_bounds(value, lower, upper)
{
	return value >= lower && value < upper;
}

// generate a totally randomized peice based on number of tiles
function generate_random_piece_with_tiles(tiles)
{
	// the initial empty piece
	var piece = new Piece(tiles, tiles, get_random_color());

	// add the amount of tiles
	for(var i = 0; i < tiles; i++)
	{
		while(true)
		{
			// get a random coordinates
			var x = Math.floor(Math.random() * piece.width);
			var y = Math.floor(Math.random() * piece.height);

			// make sure this randomness is accepted!
			if(i > 0)
			{
				// make sure this one hasn't already been set
				if(get_pixel(piece, x, y))
				{
					continue;
				}

				// gotta make sure theres a pixel near here already set
				var left_x = x - 1;
				var left_y = y;
				var right_x = x + 1;
				var right_y = y;
				var up_x = x;
				var up_y = y - 1;
				var down_x = x;
				var down_y = y + 1;

				var accepted = false;
				if(in_bounds(left_x, 0, piece.width) && in_bounds(left_y, 0, piece.height))
				{
					var pixel = get_pixel(piece, left_x, left_y);
					if(pixel) accepted = true;
				}
				if(in_bounds(right_x, 0, piece.width) && in_bounds(right_y, 0, piece.height))
				{
					var pixel = get_pixel(piece, right_x, right_y);
					if(pixel) accepted = true;
				}
				if(in_bounds(up_x, 0, piece.width) && in_bounds(up_y, 0, piece.height))
				{
					var pixel = get_pixel(piece, up_x, up_y);
					if(pixel) accepted = true;
				}
				if(in_bounds(down_x, 0, piece.width) && in_bounds(down_y, 0, piece.height))
				{
					var pixel = get_pixel(piece, down_x, down_y);
					if(pixel) accepted = true;
				}
				if(!accepted)
				{
					continue;
				}
			}

			// only gonna do this if its accepted
			set_pixel(piece, x, y, true);
			break;
		}
	}
	clean_piece(piece);
	return piece;
}

// translate a piece
// no wrapping
// but if you wanted that you should go change the get and set pixel functions
function translate_piece(piece, offset_x, offset_y)
{
	var translated_map = piece.map.slice(0);
	for(var y = 0; y < piece.width; y++)
	{
		for(var x = 0; x < piece.height; x++)
		{
			var source = get_pixel(piece, x - offset_x, y - offset_y);
			translated_map[x + y * piece.width] = source;
		}
	}
	piece.map = translated_map;
}

// resize a piece properly
function resize_piece(piece, width, height)
{
	var width_delta = width - piece.width;
	var height_delta = height - piece.height;

	// for adding space
	if(height_delta > 0)
	{
		for(var i = 0; i < height_delta * piece.width; i++)
		{
			piece.map.push(false);
		}
	}
	// for removing space
	else
	{
		for(var i = 0; i < -height_delta * piece.width; i++)
		{
			piece.map.pop();
		}
	}
	piece.height = height;

	// add space
	if(width_delta > 0)
	{
		for(var i = piece.height - 1; i >= 0; i--)
		{
			for(var j = 0; j < width_delta; j++)
			{
				piece.map.splice(piece.width + i * piece.width, 0, false);
			}
		}
	}
	// and remove
	else
	{
		for(var i = 0; i < piece.height; i++)
		{
			piece.map.splice(width + i * width, -width_delta);
		}
	}
	piece.width = width;
}

// see if rows or columns are empty or not
function row_is_empty(piece, row)
{
	for(var i = 0; i < piece.width; i++)
	{
		if(get_pixel(piece, i, row)) return false;
	}
	return true;
}

// see if rows or columns are empty or not
function column_is_empty(piece, column)
{
	for(var i = 0; i < piece.height; i++)
	{
		if(get_pixel(piece, column, i)) return false;
	}
	return true;
}

// see how many empty rows or colmuns there are up front
function get_initial_empty_rows(piece)
{
	var i;
	for(i = 0; i < piece.height; i++)
	{
		if(!row_is_empty(piece, i)) break;
	}
	return i;
}

// see how many empty rows or colmuns there are up front
function get_initial_empty_columns(piece)
{
	var i;
	for(i = 0; i < piece.width; i++)
	{
		if(!column_is_empty(piece, i)) break;
	}
	return i;
}

// see how many non empty rows or colmuns there are up front
function get_initial_non_empty_rows(piece)
{
	var i;
	for(i = 0; i < piece.height; i++)
	{
		if(row_is_empty(piece, i)) break;
	}
	return i;
}

// see how many non empty rows or colmuns there are up front
function get_initial_non_empty_columns(piece)
{
	var i;
	for(i = 0; i < piece.width; i++)
	{
		if(column_is_empty(piece, i)) break;
	}
	return i;
}

// resize so there are no empty rows or columns
function clean_piece(piece)
{
	// get the initial empty space to clean up
	var initial_x = get_initial_empty_columns(piece);
	var initial_y = get_initial_empty_rows(piece);

	// translate it back to fill that space
	translate_piece(piece, -initial_x, -initial_y);

	// then get how much final empty space there is to clean
	var final_x = get_initial_non_empty_columns(piece);
	var final_y = get_initial_non_empty_rows(piece);

	// and resize to that amount
	resize_piece(piece, final_x, final_y);

	// and then recenter the pivot
	center_pivot(piece);
}

// the collection of pieces to use in the game
var piece_set = [];

// generate a random set of pieces
function generate_set_with_generator(generator, pieces)
{
	var piece_set = [];
	for(var i = 0; i < pieces; i++)
	{
		piece_set.push(generator());
	}
	return piece_set;
}

// do that with the by-tile-count generator
function generate_set_with_tiles(tiles, pieces)
{
	var generator = function() { return generate_random_piece_with_tiles(tiles); };
	return generate_set_with_generator(generator, pieces);
}

// do that with the by-size generator
function generate_set_with_size(width, height, pieces)
{
	var generator = function() { return generate_random_piece_with_size(width, height); };
	return generate_set_with_generator(generator, pieces);
}

///////////// INTERFACE STUFF ///////////////////

// interface elements
var editor_view;
var editor_menu;
var editor_color;
var editor_width;
var editor_height;

// some live interface variabes
var selection_coordinates = null;

// clear a select
function clear_select(element)
{
	while(element.options.length)
	{
		element.remove(0);
	}
}

// populate the piece menu
function populate_piece_menu()
{
	// get that menu and make sure its empty before adding new chunk to it >:C
	clear_select(editor_menu);

	// and then stuff it with junk c:
	var index = 0;
	for(piece in piece_set)
	{
		var option = document.createElement("option");
		option.value = index;
		option.innerHTML = "Piece #" + index;
		editor_menu.appendChild(option);
		index++;
	}
}

// get the currently selected piece to show up in the editor nd stuff
function get_selected_piece()
{
	var index = editor_menu.selectedIndex;
	return piece_set[index];
}

// convert a coordinate from tile coordinates to pixel coordinates in the editor
function tile_to_pixel(coordinate)
{
	// first scale it
	coordinate *= tile_size;
	
	// and then adjust it for grid alignment
	coordinate += grid_thickness / 2;

	// boom
	return coordinate;
}

// and do the opposite too!
function pixel_to_tile(coordinate)
{
	// first unadjust for grid alignment
	coordinate -= grid_thickness / 2;

	// and then unscale it
	coordinate /= tile_size;

	// and round it down, because tile coordinates are discrete
	coordinate = Math.floor(coordinate);

	// boom
	return coordinate;
}

// render a tile
function render_tile(x, y, color, context, render_function)
{
	// set up styles nd stuff
	context.fillStyle = color;
	context.strokeStyle = color;
	context.lineWidth = grid_thickness;

	// get the pixel coordinates
	var canvas_x = tile_to_pixel(x);
	var canvas_y = tile_to_pixel(y);

	// and draw that pixel >:3
	render_function(canvas_x, canvas_y, tile_size, tile_size);
}

// this one _fills_ it
function fill_tile(x, y, color, context)
{
	var render_function = function(x, y, width, height) { context.fillRect(x, y, width, height); };
	render_tile(x, y, color, context, render_function);
}

// this one _strokes it
function stroke_tile(x, y, color, context)
{
	var render_function = function(x, y, width, height) { context.strokeRect(x, y, width, height); };
	render_tile(x, y, color, context, render_function);
}

// render a single pixel / tile of a piece
function render_pixel(x, y, piece, context)
{
	// get the appriate colors for this "pixel"
	var pixel = get_pixel(piece, x, y);
	var color = pixel ? piece.color : background_color;
	var stroke_color = is_pivot(piece, x, y) ? grid_pivot_color : grid_color;
	stroke_color = is_selection_coordinates(x, y) ? grid_selected_color : stroke_color;
	
	// and then fill nd stroke it
	fill_tile(x, y, color, context);
	stroke_tile(x, y, stroke_color, context);
}

// render a piece on the editor nd stuff
function render_editor()
{
	// first get the piece to make show up
	var piece = get_selected_piece();

	// get the pixel width and height to set the canvas
	// add space for the extra grid pixels
	var canvas_width = tile_size * piece.width + grid_thickness;
	var canvas_height = tile_size * piece.height + grid_thickness;

	// and set it, of course
	editor_view.width = canvas_width;
	editor_view.height = canvas_height;

	// and then render the dang piece :D
	for (var y = 0; y < piece.height; y++)
	{
		for (var x = 0; x < piece.width; x++)
		{
			// render that pixel
			render_pixel(x, y, piece, editor_context);
		}	
	}

	// after all that u gotta rerender the selection and pivot to make sure its in front
	render_pivot(editor_context);
	render_select(editor_context);
}

// get the relative mouse coordinates from a mouse event
function get_relative_mouse_coordinates(event)
{
	var mouse_x, mouse_y;

	if(event.offsetX)
	{
		mouse_x = event.offsetX;
		mouse_y = event.offsetY;
	}
	else if(event.layerX)
	{
		mouse_x = event.layerX;
		mouse_y = event.layerY;
	}

	return { x: mouse_x, y: mouse_y };
}

// are these coordinates the coordinates of the selection?
function is_selection_coordinates(x, y)
{
	if(selection_coordinates == null)
	{
		return false;
	}
	else
	{
		return x == selection_coordinates.x && y == selection_coordinates.y;
	}
}

// render the pivot border
function render_pivot(context)
{
	var piece = get_selected_piece();
	stroke_tile(piece.pivot_x, piece.pivot_y, grid_pivot_color, context);
}

// render the selected border for whatever tile is curently selected
function render_select(context)
{
	if(selection_coordinates != null)
	{
		stroke_tile(selection_coordinates.x, selection_coordinates.y, grid_selected_color, context);
	}
}

// render the UNselected border for whatever tile is curently selected
function render_deselect(context)
{
	if(selection_coordinates != null)
	{
		stroke_tile(selection_coordinates.x, selection_coordinates.y, grid_color, context);
	}
	render_pivot(context);
}

// select a tile in the editor
function editor_select(x, y, context)
{
	// first delect anything that's there
	editor_deselect(context);

	// and save the selection corodinates
	selection_coordinates = { x: x, y: y };

	// now render that tiles border with a selected color!
	render_select(context);
}

// deselect all tiles in the editor
function editor_deselect(context)
{
	// render a deselect of whatever's selected now first
	render_deselect(context);

	// and then save the null selection coordinates
	selection_coordinates = null;
}

// the mouse was moved in the editor
// so gotta update the grid for selection
function on_mouse_move_editor(event)
{
	// first get the mouse coordinates in pixels
	var mouse_coordinates = get_relative_mouse_coordinates(event);

	// then convert them to tile units
	var x = pixel_to_tile(mouse_coordinates.x);
	var y = pixel_to_tile(mouse_coordinates.y);

	// select it
	editor_select(x, y, editor_context);
}

// deselect stuff when the mouse leaves
function on_mouse_out_editor()
{
	// deselect things on it
	editor_deselect(editor_context);
}

// and when you click, gotta toggle the pixel!!
function on_click_editor(event)
{
	// first get the mouse coordinates in pixels
	var mouse_coordinates = get_relative_mouse_coordinates(event);

	// then convert them to tile units
	var x = pixel_to_tile(mouse_coordinates.x);
	var y = pixel_to_tile(mouse_coordinates.y);

	// get the selected piece
	var piece = get_selected_piece();

	// and then get the corresponding pixel
	var pixel = get_pixel(piece, x, y);

	// flip it
	pixel = !pixel;

	// and store it back
	set_pixel(piece, x, y, pixel);

	// and render that tile
	render_pixel(x, y, piece, editor_context);
}

// and when you right click, gotta set the pivot!!
function on_right_click_editor(event)
{
	// first get the mouse coordinates in pixels
	var mouse_coordinates = get_relative_mouse_coordinates(event);

	// then convert them to tile units
	var x = pixel_to_tile(mouse_coordinates.x);
	var y = pixel_to_tile(mouse_coordinates.y);

	// get the selected piece
	var piece = get_selected_piece();

	// save the coordinates of the old pivot
	var old_pivot_x = piece.pivot_x;
	var old_pivot_y = piece.pivot_y;

	// and set the pivot
	piece.pivot_x = x;
	piece.pivot_y = y;

	// and then render the old pivot
	render_pixel(old_pivot_x, old_pivot_y, piece, editor_context);

	// and render that tile
	render_pixel(x, y, piece, editor_context);

	// and no context menu!!!!!
	return false;
}

// this happens when you change a color
function on_color_change()
{
	// get the current piece and change its color to the one in the picker yeah
	var piece = get_selected_piece();
	piece.color = editor_color.value;

	// update everything because the color is supposedly different now
	update_editor();
}

// this happens when you change a size
function on_size_change()
{
	// get the current piece and change its color to the one in the picker yeah
	var piece = get_selected_piece();
	resize_piece(piece, parseInt(editor_width.value), parseInt(editor_height.value));

	// update everything because the color is supposedly different now
	update_editor();
}

// what happens when you select a piece from the menu
// show it up on the editor nd other stuff
function on_piece_select()
{
	update_editor();
}

// yeah do all the stuff
function update_editor()
{
	// draw the piece on the editor view!
	render_editor();

	// and then get the piece and update the color picker, and the others
	var piece = get_selected_piece();
	editor_color.value = piece.color;
	editor_width.value = piece.width;
	editor_height.value = piece.height;
}

// initialize!!!!!!!
function on_load()
{
	// get all the interface elements
	editor_view = document.getElementById("editor-view");
	editor_menu = document.getElementById("pieces");
	editor_color = document.getElementById("color");
	editor_width = document.getElementById("width");
	editor_height = document.getElementById("height");

	// and get contexts
	editor_context = editor_view.getContext("2d");

	// and set up mouse events for the editor n stuff
	editor_view.onmousemove = on_mouse_move_editor;
	editor_view.onmouseout = on_mouse_out_editor;
	editor_view.onclick = on_click_editor;
	editor_view.oncontextmenu = on_right_click_editor;

	// setup some piece menu events nd the other things
	editor_menu.onchange = on_piece_select;
	editor_color.onchange = on_color_change;
	editor_width.onchange = on_size_change;
	editor_height.onchange = on_size_change;

	// generate a simple set to start out with
	piece_set = generate_set_with_tiles(5, 7);

	// nd update that list yo
	populate_piece_menu();

	// andddddd update all the editor stuff real quick
	update_editor();
}

document.addEventListener("DOMContentLoaded", on_load, false);