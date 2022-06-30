import React, {Component} from 'react'
import tether from '../tether.png'

class Main extends Component {
    // Our React Code Goes In Here!
    render() {
        return (
            <div id = 'content' className = 'mt-3'>
                <table className = 'table text-muted text-center'>
                    <thead>
                    <tr style = {{color:'black'}}>
                        <th scope='col'>Staking Balance</th>
                        <th scope='col'>Reward Balance</th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr style={{color:'black'}}>
                            <td>USDT</td>
                            <td>RWD</td>
                        </tr>
                    </tbody>
                </table>
                <div classname = 'card mb-2' style = {{opacity: '.9'}}>
                    <form className = 'mb-3'>
                        <div style={{borderSpace:'0 1em'}}>
                            <label className='float-left' style = {{marginLeft:'15px'}}>
                                <b>Stake Tokens</b>
                            </label>
                            <span className='float-right' style={{marginRight:'8px'}}>
                                Balance:
                            </span>
                            <div className = 'input-group mb-4'>
                                <input 
                                type='text'
                                placeholder='0'
                                required/>
                                <div className='input-grouped-open'>
                                    <div className='input-group-text'>
                                        <img alt='tether' src={tether} />
                                        &nbps;&nbps;&nbps;
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default Main;