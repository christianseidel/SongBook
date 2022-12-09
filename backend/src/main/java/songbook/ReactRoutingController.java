package songbook;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

public class ReactRoutingController {

    @Controller
    public static class ReactRoutingForwarding {
        @RequestMapping(value = "/**/{[path:[^\\.]*}")
        public String forwardToRouteUrl() {
            return "forward:/";
        }
    }
}
