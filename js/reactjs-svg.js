var SVGComponent = React.createClass({
    render: function() {
        return this.transferPropsTo(
            <svg>{this.props.children}</svg>
        );
    }
});

React.renderComponent(
    <SVGComponent height="50" width="50" />,
    document.getElementById('svg_mount_example')
);