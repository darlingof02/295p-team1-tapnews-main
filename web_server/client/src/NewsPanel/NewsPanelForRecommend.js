import './NewsPanel.css';
import _ from 'lodash';
import React from 'react';
import Auth from '../Auth/Auth';
import 'bootstrap/dist/css/bootstrap.min.css';


import NewsCard from '../NewsCard/NewsCard';
import { Link, withRouter} from 'react-router-dom';

class NewsPanelForRecommend extends React.Component {
    constructor(props) {
        
        super(props);
        this.state = { news: null, pageNum: 1, totalPages: 1, loadedAll: false};
        this.handleScroll = this.handleScroll.bind(this);
        this.renderNews = this.renderNews.bind(this);
        
    }

    componentDidMount() {
        if (Auth.isUserAuthenticated()) {
            this.loadLikedNews();
        }

        // 防抖
        this.loadMoreNews = _.debounce(this.loadLikedNews, 1000);
        window.addEventListener('scroll', this.handleScroll);
    }
    handleScroll() {
        let scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        if ((window.innerHeight + scrollY) >= (document.body.offsetHeight - 50)) {
            // 滚动到了最底部。
            console.log('Loading more news');
            this.loadLikedNews();
        }
    }
    loadLikedNews(e) {
        if (this.state.loadedAll === true) {
            return;
        }
        let url = 'http://localhost:3000/news/recommend/userId/' + Auth.getEmail() + `${this.state.category}/pageNum/` + this.state.pageNum
        let request = new Request(encodeURI(url), {
            method: 'GET',
            headers: {
                'Authorization': 'bearer ' + Auth.getToken(),
            },
            cache: 'no-cache',
        });

        fetch(request)
            .then((res) => res.json())
            .then((news) => {
                if (!news || news.length === 0) {
                    this.setState({ loadedAll: true });
                }
                this.setState({
                    news: this.state.news ? this.state.news.concat(news) : news,
                    pageNum: this.state.pageNum + 1
                });
            });
    }
    // loadMoreNews(e) {
    //     if (this.state.loadedAll === true) {
    //         return;
    //     }
    //     let url = 'http://localhost:3000/news/userId/' + Auth.getEmail() + `${this.state.category}/pageNum/` + this.state.pageNum
    //     let request = new Request(encodeURI(url), {
    //         method: 'GET',
    //         headers: {
    //             'Authorization': 'bearer ' + Auth.getToken(),
    //         },
    //         cache: 'no-cache',
    //     });

    //     fetch(request)
    //         .then((res) => res.json())
    //         .then((news) => {
    //             if (!news || news.length === 0) {
    //                 this.setState({ loadedAll: true });
    //             }
    //             this.setState({
    //                 news: this.state.news ? this.state.news.concat(news) : news,
    //                 pageNum: this.state.pageNum + 1
    //             });
    //         });
    // }

    renderNews() {
        let category = this.state.category
        console.log(this.state.news)
        var news_list = this.state.news.map(function (news) {
            console.log(news.class)
            if (news.class == category)
                return (
                <a className='list-group-item' key={news.digest} href="#">
                    <NewsCard news={news} />
                </a>
                );
            else 
                return <div></div>
        });
        return (
            <div className="container-fluid">
                <div className='list-group'>
                    {news_list}
                </div>
            </div>
        );
    }

    render() {
        if (Auth.isUserAuthenticated()) {
            if (this.state.news) {
                return (
                    <div>
                        {this.renderNews()}
                    </div>
                );
            } else {
                return (
                    <div>
                        <div id='msg-app-loading'>
                            Loading
                        </div>
                    </div>
                )
            }
        } else {
            this.props.history.replace("/login")

            return (
                <div className='container'>
                    Please login first
                </div>
            )
        }
    }
}

// export default NewsPanel;
export default withRouter(NewsPanelForRecommend);
