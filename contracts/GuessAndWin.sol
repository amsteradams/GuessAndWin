// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.13;

import '@openzeppelin/contracts/access/Ownable.sol';

contract GuessAndWin is Ownable{
    string public hint; 
    string private word; //word to find
    mapping(address => uint) public HasTried; // HasTried[0] => never play, HasTried[1] tried once
    address[] private log;
    address public winner;
    constructor(string memory _hint, string memory _word) {
        require(keccak256(abi.encodePacked(_hint)) != keccak256(abi.encodePacked(_word)), "word and hint have to be different");
        hint = _hint;
        word = _word;
    }
    /*
        verify if the player has already tried once
        write in the mapping that this address tried
        then compare the try and the word
        if it match, send all contract's eth to msg.sender
        return true
        else return false
    */
    function proposeWord(string memory tmpString)external payable returns(bool){
        require(HasTried[msg.sender] < 1, "Sorry, you already got your chance");
        require(msg.value >= (1 ether - tx.gasprice), "Pay 1 eth to try");
        HasTried[msg.sender] += 1;
        log.push(msg.sender);
        if(keccak256(abi.encodePacked(tmpString)) == keccak256(abi.encodePacked(word))){
            (bool sent, ) = msg.sender.call{value: seePrize()}("");
            require(sent, "Failed to send Ether");
            winner = msg.sender;
            restart();
            return true;
        }
            return false;
    }

    /*
        Owner can change the word, but restart the mapping to be fair
    */
    function changeWord(string memory str, string memory hintStr)external onlyOwner{
        require(keccak256(abi.encodePacked(str)) != keccak256(abi.encodePacked(hintStr)), "word and hint have to be different");
        hint = hintStr;
        word = str;
        winner = address(0);
        restart();
    }
    /*
        restart the mapping;
    */
    function restart() private {
        for(uint i; i < log.length; i++){
            HasTried[log[i]] = 0;
        }
        delete log;
    }

    /*
        winner = 0x00... means nobody find the word
    */
    function hasSomeoneWin()external view returns(bool){
        if(winner == 0x0000000000000000000000000000000000000000){
            return false;
        }
            return true;
    }

    
    function seePrize()public view returns(uint){
        return address(this).balance;
    }

    receive()external payable{

    }

}
