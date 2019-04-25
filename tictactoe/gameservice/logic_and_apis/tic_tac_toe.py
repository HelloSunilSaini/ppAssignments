

class TicTacToe :
    def __init__(self):
        self.state = [
            ['-','-','-'],
            ['-','-','-'],
            ['-','-','-']
        ]

    def __eq__(self,other):
        if self.__class__ != other.__class__:
            return False
        else:
            return self.state == other.state

    def __str__(self):
        chess_board_view = ""
        for row in self.state:
            chess_board_view += str(row) + "\n"
        return chess_board_view

    def assignNewStateValue(self,newState):
        for row in range(3):
            for col in range(3):
                self.state[row][col] = newState[row][col]

    def checkWinner(self):
        for player in ['O','X']:
            for i in range(3):
                # row checking
                for j in range(3):
                    if self.state[i][j] != player :
                        break
                    if (j == 2) :
                        return player
                # coloum checking 
                for j in range(3):
                    if self.state[j][i] != player :
                        break
                    if (j == 2):
                        return player
            # for 1st diagonal checking
            for j in range(3):
                if self.state[j][j] != player:
                    break
                if (j == 2):
                    return player
            # for 2nd diagonal checking
            for j in range(3):
                if self.state[j][3-(j+1)] != player:
                    break
                if (j == 2):
                    return player
        return None


    def isGameOver(self) :
        winner = self.checkWinner()
        if winner != None:
            return True
        else:
            for row in range (3):
                for col in range (3):
                    if (self.state[row][col] == '-'):
                        return False
            return True 
        

    def isValidMove(self,other,player):
        movecount = 0
        for i in range(3):
            for j in range(3):
                if self.state[i][j] != other.state[i][j]:
                    movecount += 1
                    if other.state[i][j] != player:
                        return False
                    if self.state[i][j] != '-':
                        return False
        if (movecount == 1):
            return True
        else:
            return False

