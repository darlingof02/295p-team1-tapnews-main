import './NewsCard.css';
import React from 'react';
import Auth from '../Auth/Auth';
import {Button} from "bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import {CopyToClipboard} from 'react-copy-to-clipboard';

class NewsCard extends React.Component {
    state = {
        value: '',
        color:"black",
        copied: false,
    };
    componentDidMount() {
        if(this.findlike())
            this.setState({color:"red"})
        else
            this.setState({color:"black"})
    }
    redirectToUrl(url) {
        this.sendClickLog();
        window.open(url, '_blank');
    }
    sendClickLog() {
        let url = 'http://localhost:3000/news/userId/' + Auth.getEmail()
            + '/newsId/' + this.props.news.digest;
        let request = new Request(encodeURI(url), {
            method: 'POST',
            headers: {
                'Authorization': 'bearer ' + Auth.getToken(),
            },
            cache: "no-cache"
        });

        fetch(request);
    }
    like(){
        let url = 'http://localhost:3000/news/like/' + Auth.getEmail()
            + '/newsId/' + this.props.news.digest;
        let request = new Request(encodeURI(url), {
            method: 'POST',
            headers: {
                'Authorization': 'bearer ' + Auth.getToken(),
            },
            cache: "no-cache"
        });
        fetch(request);
    }
    findlike(){
        for (let i = 0; i < this.props.likelist.length; i++) {
            if (this.props.likelist[i]==this.props.news.digest){
                return true
            }
        }
        return false
    }
    render() {
        //console.log(this.props.likelist)


        return (
            <div>
                <CopyToClipboard text={this.props.news.url}
                                 onCopy={() => this.setState({copied: true})}>
                    <button onClick={()=>alert("Successfully copied to clip board")}>Share</button>
                </CopyToClipboard>
                {/*<button color={this.state.color} onClick={()=>this.like()}>Like</button>*/}
                <button style={{color:this.state.color}} onClick={()=>this.like()}>Like</button>
                <div className="news-container" onClick={() => this.redirectToUrl(this.props.news.url)}>
                    <div className='row'>
                        <div className='col s4 fill'>
                            <img src={this.props.news.urlToImage} alt='news' />
                        </div>
                        <div className='col s8'>
                            <div className='news-intro-col'>
                                <div className='news-intro-panel'>
                                    <h4>{this.props.news.title}</h4>
                                    <div className='news-description'>
                                        <p>{this.props.news.description}</p>
                                        <div>
                                            {this.props.news.source.id != null && <div className='chip light-blue news-chip'>{this.props.news.source.name}</div>}
                                            {this.props.news.reason != null && <div className='chip light-green news-chip'>{this.props.news.reason}</div>}
                                            {this.props.news.time != null && <div className='chip amber news-chip'>{this.props.news.time}</div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default NewsCard;