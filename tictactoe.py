#used to clear the screen
from os import system
from stuff import *

#used to display the playing board
def display_board(board):
	x = 0
	for char in board:
		print(char, end = " ")
		x += 1
		if x == 3:
			x = 0
			print('')

#used whenever the player puts a piece on the board
def edit_board(board, player, index):
	board[index - 1] = player

#used before every turn to check if the player who last moved won the game or not
def wincon(board, player):
	if(
	(board[0] == board[1] == board[2] == player) or
	(board[3] == board[4] == board[5] == player) or 
	(board[6] == board[7] == board[8] == player) or
	(board[0] == board[3] == board[6] == player) or
	(board[1] == board[4] == board[7] == player) or
	(board[2] == board[5] == board[8] == player) or
	(board[0] == board[4] == board[8] == player) or
	(board[2] == board[4] == board[6] == player)):
		display_board(board)
		dialogue(f'Player {player} Wins!')
		return True
	return False

play_board = [l for l in '---------']

system('cls')
dialogue('Welcome to Tic-Tac-Toe! (Press enter to continue)')

if dialogue('To skip the instructions, type skip, or press enter to continue ').lower() != 'skip':
	display_board(play_board)
	dialogue('Instructions: Players will take turns placing their piece on the board. X will always go first.')
	display_board([l for l in '123456789'])
	dialogue('These are the indexes for each place on the board.')
	display_board(play_board)
	dialogue('Lets start with an example game.')
	edit_board(play_board, 'X', 5)
	display_board(play_board)
	dialogue('Player X places his piece in the 5th index, or center of the board.')
	edit_board(play_board, 'O', 6)
	display_board(play_board)
	dialogue('Player O places his piece in the 6th index, or right center of the board.')
	edit_board(play_board, 'X', 1)
	edit_board(play_board, 'O', 3)
	edit_board(play_board, 'X', 9)
	display_board(play_board)
	dialogue('The game progresses until one of the players connect 3 of their pieces in a row, and wins the game!')
	dialogue('Ready to play? Lets go!')
	play_board = [l for l in '---------']

while True:
	player = 'O'
	while True:
		stalemate = True
		if wincon(play_board, player):
			break
		for l in play_board:
			for x in l:
				if x == '-':
					stalemate = False
					break
		if stalemate:
			display_board(play_board)
			dialogue('Stalemate.')
			break
		if player == 'O':
			player = 'X'
		else:
			player = 'O'
		while True:
			display_board(play_board)
			choice = num_input(f'Player {player}, choose your index (1-9): ')
			system('cls')
			if choice == 0 or choice > 9:
				print('Please choose a number from 1-9.')
				continue
			if play_board[choice - 1] != '-':
				print('That index already has a piece.')
				continue
			edit_board(play_board, player, choice)
			break
	dialogue('Press enter to play again ')
	play_board = [l for l in '---------']