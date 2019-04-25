

class ChessGame :
    def __init__(self):
        # capital letters are for white pieces and small letter for black pieces
        self.state = [
            ['R','N','B','Q','K','B','N','R'],
            ['P','P','P','P','P','P','P','P'],
            ['-','-','-','-','-','-','-','-'],
            ['-','-','-','-','-','-','-','-'],
            ['-','-','-','-','-','-','-','-'],
            ['-','-','-','-','-','-','-','-'],
            ['p','p','p','p','p','p','p','p'],
            ['r','n','b','q','k','b','n','r']
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
        for row in range(8):
            for col in range(8):
                self.state[row][col] = newState[row][col]
        
    def isGameOver(self) :
        kingCount = 0
        whiteKingCount = 0
        balckKingCount = 0
        for row in range(8) :
            for col in range(8) :
                if self.state[row][col] == 'k':
                    balckKingCount += 1
                    kingCount += 1
                elif self.state[row][col] == 'K' :
                    whiteKingCount += 1
                    kingCount += 1
        if kingCount < 2 or balckKingCount < 1 or whiteKingCount < 1 :
            return True
        else :
            return False 

    def __validatePawnMove(self,startpos,endPos,start_key,end_prev_key,end_new_key,newchessboard):
        if start_key == 'p':
            if startpos[1] == endPos[1] :
                if end_prev_key != '-':
                    return False
                else:
                    if startpos[0]-1 == endPos[0]:
                        return True
                    elif startpos[0] == 6 and startpos[0]-2 == endPos[0] and newchessboard[5][startpos[1]] == '-': 
                        return True
                    else :
                        return False
            elif startpos[1]+1 == endPos[1] or startpos[1]-1 == endPos[1]:
                if end_prev_key == '-':
                    return False
                else:
                    if startpos[0]-1 == endPos[0]:
                        return True
                    else:
                        return False
            else:
                return False
        elif start_key == 'P':
            if startpos[1] == endPos[1] :
                if end_prev_key != '-':
                    return False
                else:
                    if startpos[0]+1 == endPos[0]:
                        return True
                    elif startpos[0] == 1 and startpos[0]+2 == endPos[0] and newchessboard[2][startpos[1]] == '-':
                        return True
                    else :
                        return False
            elif startpos[1]+1 == endPos[1] or startpos[1]-1 == endPos[1]:
                if end_prev_key == '-':
                    return False
                else:
                    if startpos[0]+1 == endPos[0]:
                        return True
                    else:
                        return False
            else:
                return False
        else:
            return False

    def __validateRookMove(self,startpos,endPos,start_key,end_prev_key,end_new_key,newchessboard):
        if startpos[0] == endPos[0] :
            if startpos[1] < endPos[1]:
                col_diff = endPos[1] - startpos[1] -1
                for i in range(col_diff):
                    if newchessboard[startpos[0]][startpos[1]+(i+1)] != '-' :
                        return False 
                return True
            elif startpos[1] > endPos[1]:
                col_diff = startpos[1] - endPos[1] -1
                for i in range(col_diff):
                    if newchessboard[startpos[0]][endPos[1]+(i+1)] != '-':
                        return False
                return True
            else :
                return False
        elif startpos[1] == endPos[1]:
            if startpos[0] < endPos[0]:
                row_diff = endPos[0] - startpos[0] -1
                for i in range(row_diff):
                    if newchessboard[startpos[0]+(i+1)][startpos[1]] != '-':
                        return False
                return True
            elif startpos[0] > endPos[0]:
                row_diff = startpos[0] - endPos[0] -1
                for i in range(row_diff):
                    if newchessboard[endPos[0]+(i+1)][startpos[1]] != '-':
                        return False
                return True
            else:
                return False
        else :
            return False

    def __validateKnightMove(self,startpos,endPos,start_key,end_prev_key,end_new_key):
        if startpos[0]+2 == endPos[0] or startpos[0]-2 == endPos[0] :
            if startpos[1]+1 == endPos[1] or startpos[1]-1 == endPos[1]:
                return True
            else :
                return False
        elif startpos[1]+2 == endPos[1] or startpos[1]-2 == endPos[1] :
            if startpos[0]+1 == endPos[0] or startpos[0]-1 == endPos[0] :
                return True
            else:
                return False
        else:
            return False

    def __validateBishopMove(self,startpos,endPos,start_key,end_prev_key,end_new_key,newchessboard):
        if abs(startpos[0] - endPos[0]) == abs(startpos[1] - endPos[1]) :
            row_or_col_diff = abs(startpos[0] - endPos[0]) - 1
            if startpos[0] < endPos[0] :
                if startpos[1] < endPos[1]:
                    for i in range(row_or_col_diff):
                        if newchessboard[startpos[0]+(i+1)][startpos[1]+(i+1)] != '-':
                            return False
                    return True
                elif startpos[1] > endPos[1]:
                    for i in range(row_or_col_diff):
                        if newchessboard[startpos[0]+(i+1)][endPos[1]+(i+1)] != '-':
                            return False
                    return True
                else :
                    return False
            elif startpos[0] > endPos[0] :
                if startpos[1] < endPos[1]:
                    for i in range(row_or_col_diff):
                        if newchessboard[endPos[0]+(i+1)][startpos[1]+(i+1)] != '-':
                            return False
                    return True
                elif startpos[1] > endPos[1]:
                    for i in range(row_or_col_diff):
                        if newchessboard[endPos[0]+(i+1)][endPos[1]+(i+1)] != '-':
                            return False
                    return True
                else :
                    return False
            else :
                return False
        else:
            return False

    def __validateQueenMove(self,startpos,endPos,start_key,end_prev_key,end_new_key,newchessboard):
        if startpos[0] == endPos[0] or startpos[1] == endPos[1]:
            if startpos[0] == endPos[0] :
                if startpos[1] < endPos[1]:
                    col_diff = endPos[1] - startpos[1] -1
                    for i in range(col_diff):
                        if newchessboard[startpos[0]][startpos[1]+(i+1)] != '-' :
                            return False 
                    return True
                elif startpos[1] > endPos[1]:
                    col_diff = startpos[1] - endPos[1] -1
                    for i in range(col_diff):
                        if newchessboard[startpos[0]][endPos[1]+(i+1)] != '-':
                            return False
                    return True
                else :
                    return False
            elif startpos[1] == endPos[1]:
                if startpos[0] < endPos[0]:
                    row_diff = endPos[0] - startpos[0] -1
                    for i in range(row_diff):
                        if newchessboard[startpos[0]+(i+1)][startpos[1]] != '-':
                            return False
                    return True
                elif startpos[0] > endPos[0]:
                    row_diff = startpos[0] - endPos[0] -1
                    for i in range(row_diff):
                        if newchessboard[endPos[0]+(i+1)][startpos[1]] != '-':
                            return False
                    return True
                else:
                    return False
            else :
                return False
        elif abs(startpos[0] - endPos[0]) == abs(startpos[1] - endPos[1]) :
            row_or_col_diff = abs(startpos[0] - endPos[0]) - 1
            if startpos[0] < endPos[0] :
                if startpos[1] < endPos[1]:
                    for i in range(row_or_col_diff):
                        if newchessboard[startpos[0]+(i+1)][startpos[1]+(i+1)] != '-':
                            return False
                    return True
                elif startpos[1] > endPos[1]:
                    for i in range(row_or_col_diff):
                        if newchessboard[startpos[0]+(i+1)][endPos[1]+(i+1)] != '-':
                            return False
                    return True
                else :
                    return False
            elif startpos[0] > endPos[0] :
                if startpos[1] < endPos[1]:
                    for i in range(row_or_col_diff):
                        if newchessboard[endPos[0]+(i+1)][startpos[1]+(i+1)] != '-':
                            return False
                    return True
                elif startpos[1] > endPos[1]:
                    for i in range(row_or_col_diff):
                        if newchessboard[endPos[0]+(i+1)][endPos[1]+(i+1)] != '-':
                            return False
                    return True
                else :
                    return False
            else :
                return False
        else:
            return False



    def __validatekingMove(self,startpos,endPos,start_key,end_prev_key,end_new_key):
        if 1 <= abs(startpos[0] - endPos[0]) + abs(startpos[1] - endPos[1]) <= 2 :
            if abs(startpos[1] - endPos[1]) != 2 and abs(startpos[0] - endPos[0]) != 2:
                return True
            else :
                return False
        else :
            return False 


    def isValidMove(self,other,player):
        chessBoxChangeCount = 0
        startCount = 0
        start_row,start_col = [None,None]
        start_Key = None
        endCount = 0
        end_row,end_col = [None,None] 
        end_prev_key,end_new_key = [None,None]
        for row in range(8):
            for col in range(8):
                if self.state[row][col] != other.state[row][col] :
                    chessBoxChangeCount += 1
                    if self.state[row][col] != '-' and other.state[row][col] == '-':
                        startCount += 1
                        start_row = row
                        start_col = col
                        start_Key = self.state[row][col]
                    else:
                        endCount += 1
                        end_row = row
                        end_col = col
                        end_prev_key = self.state[row][col]
                        end_new_key = other.state[row][col]
        
        if chessBoxChangeCount != 2 or startCount != 1 or endCount != 1:
            return False

        if start_row == None or start_col == None or end_row == None or end_col == None :
            return False

        if start_Key == None or end_prev_key == None or end_new_key == None:
            return False                 

        if start_Key != end_new_key :
            return False

        if start_Key in ['p','r','n','b','q','k'] and end_prev_key in ['p','r','n','b','q','k']:
            return False

        if start_Key in ['P','R','N','B','Q','K'] and end_prev_key in ['P','R','N','B','Q','K']:
            return False
        
        if start_Key in ['p','r','n','b','q','k'] and player != "BLACK" :
            return False

        if start_Key in ['P','R','N','B','Q','K'] and player != "WHITE" :
            return False

        if start_Key == 'p' or start_Key == 'P' :
            return self.__validatePawnMove([start_row,start_col],[end_row,end_col],start_Key,end_prev_key,end_new_key,other.state)

        if start_Key == 'r' or start_Key == 'R' :
            return self.__validateRookMove([start_row,start_col],[end_row,end_col],start_Key,end_prev_key,end_new_key,other.state)

        if start_Key == 'n' or start_Key == 'N' :
            return self.__validateKnightMove([start_row,start_col],[end_row,end_col],start_Key,end_prev_key,end_new_key)

        if start_Key == 'b' or start_Key == 'B' :
            return self.__validateBishopMove([start_row,start_col],[end_row,end_col],start_Key,end_prev_key,end_new_key,other.state)

        if start_Key == 'q' or start_Key == 'Q' :
            return self.__validateQueenMove([start_row,start_col],[end_row,end_col],start_Key,end_prev_key,end_new_key,other.state)

        if start_Key == 'k' or start_Key == 'K' :
            return self.__validatekingMove([start_row,start_col],[end_row,end_col],start_Key,end_prev_key,end_new_key)
