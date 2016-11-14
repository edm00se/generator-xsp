<% if (namespace || package) { %>
package <% if (namespace) { %><%= namespace %><% } %><% if (package) { %><%= package %><% } %>;<% } %>

import java.io.Serializable;

import com.ibm.xsp.extlib.util.ExtLibUtil;

/**
 * <%= name %> class, configured as a managed bean in <%= scope %>.
 */
public class <%= name %> implements Serializable {

  private static final long serialVersionUID = 1L;
  private static final String myBeanName = "<%= lowerCaseName %>Bean";

  <%= name %>(){
    // constructor intentionally left blank
  }

  public statc <%= name %> getCurrentInstance(){
    return (<%= name %>) ExtLibUtil.resolveVariable(FacesContext.getCurrentInstance(), <%= name %>.myBeanName);
  }

}
