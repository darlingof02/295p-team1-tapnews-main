import './NewsPanel.css';
import _ from 'lodash';
import React from 'react';
import Auth from '../Auth/Auth';
import { IP } from '../const';

import NewsCard from '../NewsCard/NewsCard';
import { Link, withRouter } from 'react-router-dom';

class NewsPanel extends React.Component {
    constructor() {
        super();
        this.state = { news: null, pageNum: 1, totalPages: 1, loadedAll: false, likelist:[]};
        this.handleScroll = this.handleScroll.bind(this);
        this.renderNews = this.renderNews.bind(this);

    }

    componentDidMount() {
        if (Auth.isUserAuthenticated()) {
            this.loadMoreNews();
            this.loadLike();
        }
        // 防抖
        this.loadMoreNews = _.debounce(this.loadMoreNews, 1000);
        window.addEventListener('scroll', this.handleScroll);
    }
    handleScroll() {
        let scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        if ((window.innerHeight + scrollY) >= (document.body.offsetHeight - 50)) {
            // 滚动到了最底部。
            console.log('Loading more news');

            this.loadMoreNews();
        }
    }
    loadMoreNews(e) {
        if (this.state.loadedAll === true) {
            return;
        }
        let url = `http://${IP}:3000/news/userId/` + Auth.getEmail() + '/pageNum/' + this.state.pageNum
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
                console.log(news)
                if (!news || news.length === 0) {
                    this.setState({ loadedAll: true });
                }
                this.setState({
                    news: this.state.news ? this.state.news.concat(news) : news,
                    pageNum: this.state.pageNum + 1
                });
            });
    }
    loadLike(e) {
        // if (this.state.loadedAll === true) {
        //     return;
        // }
        let url = `http://${IP}:3000/news/getlike/userId/` + Auth.getEmail() + '/pageNum/' + this.state.pageNum
        let request = new Request(encodeURI(url), {
            method: 'GET',
            headers: {
                'Authorization': 'bearer ' + Auth.getToken(),
            },
            cache: 'no-cache',
        });

        fetch(request)
            .then((res) => res.json())
            .then((list) => {
                //console.log(list)
                this.setState({ likelist:list});
                // if (!news || news.length === 0) {
                //     this.setState({ loadedAll: true });
                // }
                // this.setState({
                //     news: this.state.news ? this.state.news.concat(news) : news,
                //     pageNum: this.state.pageNum + 1
                // });
            });
    }
    unique (arr) {
        let len = arr.length
        for (let i = 0; i < len; i++) {

            for (let j = i + 1; j < len; j++) {
                if (arr[i].digest === arr[j].digest) {
                    arr.splice(j, 1)
                    len-- // 减少循环次数提高性能
                    j-- // 保证j的值自加后不变
                }
            }
        }
        return arr
    }
    renderNews() {
        //console.log(this.state.likelist)
        var temp=this.state.likelist
        this.state.news=this.unique(this.state.news)
        var news_list = this.state.news.map(function (news) {

            return (
                <a className='list-group-item' key={news.digest} href="#">
                    <NewsCard news={news} likelist={temp} />
                </a>
            );
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
export default withRouter(NewsPanel);
